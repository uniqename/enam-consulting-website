import { Handler } from '@netlify/functions';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const AssessmentSchema = z.object({
  orgId: z.string().optional(),
  responses: z.record(z.any()),
  email: z.string().email().optional(),
});

function calculateScore(responses: Record<string, any>) {
  let score = 70;

  // Challenges reduce score
  const challengeCount = Object.keys(responses).filter(
    k => k.startsWith('challenge_') && responses[k]
  ).length;
  score -= challengeCount * 5;

  // Goals boost score
  const goalCount = Object.keys(responses).filter(
    k => k.startsWith('goal_') && responses[k]
  ).length;
  score += Math.min(goalCount * 3, 15);

  // Good tools boost score
  const toolCount = Object.keys(responses).filter(
    k => k.startsWith('tool_') && responses[k]
  ).length;
  score += toolCount * 5;

  // Clamp to 0-100
  score = Math.max(0, Math.min(100, score));

  return score;
}

function getTier(score: number) {
  if (score <= 40) return 'Critical';
  if (score <= 60) return 'Needs Work';
  if (score <= 80) return 'Good Foundation';
  return 'Optimized';
}

function generateBreakdown(score: number, responses: Record<string, any>) {
  return {
    operations: Math.max(0, 100 - (responses.challenge_operations ? 30 : 0)),
    finance: Math.max(0, 100 - (responses.challenge_finance ? 30 : 0)),
    systems: responses.tool_count ? 75 : 40,
    team: Math.max(0, 100 - (responses.challenge_team ? 25 : 0)),
  };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const data = AssessmentSchema.parse(body);

    const score = calculateScore(data.responses);
    const tier = getTier(score);
    const breakdown = generateBreakdown(score, data.responses);

    // If email provided and org exists, save to database
    let assessmentId: string | null = null;
    if (data.orgId) {
      const authHeader = event.headers.authorization;
      if (authHeader) {
        const token = authHeader.substring(7);
        const { data: user } = await supabase.auth.admin.getUserById(
          extractUserIdFromToken(token)
        );

        if (user) {
          const assessment = await prisma.assessment.create({
            data: {
              orgId: data.orgId,
              createdBy: user.id,
              responses: data.responses,
              score,
              tier,
              strengths: [],
              weaknesses: [],
              risks: [],
              opportunities: [],
            },
          });

          assessmentId = assessment.id;
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        score,
        tier,
        breakdown,
        assessmentId,
      }),
    };
  } catch (error: any) {
    console.error('Error scoring assessment:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message || 'Invalid assessment data' }),
    };
  }
};

function extractUserIdFromToken(token: string): string {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return '';
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload.sub || '';
  } catch {
    return '';
  }
}

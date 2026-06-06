import { Handler } from '@netlify/functions';
import Anthropic from '@anthropic-ai/sdk';
import prisma from '../lib/prisma';

const client = new Anthropic();

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  try {
    const authHeader = event.headers.authorization;
    if (!authHeader) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };

    const userId = extractUserIdFromToken(authHeader.substring(7));
    const { message } = JSON.parse(event.body || '{}');

    if (!message) return { statusCode: 400, body: JSON.stringify({ error: 'No message' }) };

    // Get user's org and data
    const membership = await prisma.organizationMember.findFirst({
      where: { userId },
      include: { org: true },
    });

    if (!membership) return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden' }) };

    const orgId = membership.org.id;

    // Check feature gate
    if (membership.org.plan !== 'GROWTH' && membership.org.plan !== 'ENTERPRISE') {
      return { statusCode: 403, body: JSON.stringify({ error: 'Feature not available on your plan' }) };
    }

    // Get org data for context
    const latestAssessment = await prisma.assessment.findFirst({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    });

    const latestFinancial = await prisma.financialSnapshot.findFirst({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    });

    // Build system prompt with org data
    const systemPrompt = `You are a business advisor AI for a consulting firm. You have access to this organization's data:

**Business Health Score:** ${latestAssessment?.score || 'N/A'}/100
**Latest Financial Snapshot:** Revenue: $${latestFinancial?.revenue || 0}, Expenses: $${latestFinancial?.expenses || 0}, Profit: $${latestFinancial?.profit || 0}

Provide actionable business advice based on this data. Never make up numbers - only reference data you have access to.`;

    // Get or create conversation history
    let conversation = await prisma.conversationHistory.findFirst({
      where: { orgId, userId },
    });

    const messages: Anthropic.Messages.MessageParam[] = [];

    if (conversation) {
      const history = conversation.messages as any[];
      messages.push(...history);
    }

    messages.push({ role: 'user', content: message });

    // Call Claude
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const assistantMessage = response.content[0].type === 'text' ? response.content[0].text : '';

    // Save conversation
    const newMessages = [
      ...messages,
      { role: 'assistant', content: assistantMessage },
    ];

    if (conversation) {
      await prisma.conversationHistory.update({
        where: { id: conversation.id },
        data: { messages: newMessages, updatedAt: new Date() },
      });
    } else {
      await prisma.conversationHistory.create({
        data: {
          orgId,
          userId,
          messages: newMessages,
        },
      });
    }

    // Log usage
    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;

    await prisma.aiUsageLog.create({
      data: {
        orgId,
        tokensUsed: inputTokens + outputTokens,
        feature: 'chat',
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: assistantMessage,
        tokensUsed: inputTokens + outputTokens,
      }),
    };
  } catch (error: any) {
    console.error('Chat error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
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

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR MULTI-TENANT ISOLATION
-- ============================================================================
-- This file contains all RLS policies to ensure organizations' data is isolated
-- Run these policies AFTER tables are created via Prisma

-- ============================================================================
-- IMPORTANT: Enable RLS on all tables first
-- ============================================================================
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."OrganizationMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Engagement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Assessment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."KPI" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."KPIEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."FinancialSnapshot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SOPCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SOP" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SOPVersion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SOPAcknowledgment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."RiskEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PolicyDocument" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PolicyAcknowledgment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Milestone" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Comment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DecisionLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Vision" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."StrategicGoal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."OKR" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Contact" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Pipeline" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Deal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Interaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Invoice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."InvoiceLineItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."TrainingProgram" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Cohort" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Participant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SkillCheckpoint" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ParticipantProgress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."GovernmentReport" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CaseClient" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ServicePlan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ServiceGoal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CaseNote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ReferralPartner" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Referral" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."GrantFunder" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Grant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ConversationHistory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."AIUsageLog" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTION: Get current user's organizations
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_orgs(user_id UUID)
RETURNS TABLE(org_id UUID) AS $$
  SELECT DISTINCT om."orgId"
  FROM public."OrganizationMember" om
  WHERE om."userId" = user_id
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================================================
-- ORGANIZATION POLICIES
-- ============================================================================

-- Users can only read their own organizations
CREATE POLICY "org_select_own" ON public."Organization"
  FOR SELECT
  USING (id IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

-- Users can update only organizations they're admins of
CREATE POLICY "org_update_own" ON public."Organization"
  FOR UPDATE
  USING ("ownerId" = auth.uid())
  WITH CHECK ("ownerId" = auth.uid());

-- Super admin (role = SUPER_ADMIN) can see all orgs
CREATE POLICY "org_select_super_admin" ON public."Organization"
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT u.id FROM public."User" u WHERE u.role = 'SUPER_ADMIN'
    )
  );

-- ============================================================================
-- ORGANIZATION MEMBER POLICIES
-- ============================================================================

CREATE POLICY "org_member_select" ON public."OrganizationMember"
  FOR SELECT
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "org_member_insert" ON public."OrganizationMember"
  FOR INSERT
  WITH CHECK ("orgId" IN (
    SELECT "orgId" FROM public."OrganizationMember"
    WHERE "userId" = auth.uid() AND role = 'ADMIN'
  ));

CREATE POLICY "org_member_update" ON public."OrganizationMember"
  FOR UPDATE
  USING ("orgId" IN (
    SELECT "orgId" FROM public."OrganizationMember"
    WHERE "userId" = auth.uid() AND role = 'ADMIN'
  ));

-- ============================================================================
-- ENGAGEMENT POLICIES
-- ============================================================================

CREATE POLICY "engagement_select" ON public."Engagement"
  FOR SELECT
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "engagement_insert" ON public."Engagement"
  FOR INSERT
  WITH CHECK ("orgId" IN (
    SELECT "orgId" FROM public."OrganizationMember"
    WHERE "userId" = auth.uid() AND role = 'ADMIN'
  ));

CREATE POLICY "engagement_update" ON public."Engagement"
  FOR UPDATE
  USING ("orgId" IN (
    SELECT "orgId" FROM public."OrganizationMember"
    WHERE "userId" = auth.uid() AND role = 'ADMIN'
  ));

-- ============================================================================
-- ASSESSMENT POLICIES
-- ============================================================================

CREATE POLICY "assessment_select" ON public."Assessment"
  FOR SELECT
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "assessment_insert" ON public."Assessment"
  FOR INSERT
  WITH CHECK ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

-- ============================================================================
-- KPI POLICIES
-- ============================================================================

CREATE POLICY "kpi_select" ON public."KPI"
  FOR SELECT
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "kpi_insert" ON public."KPI"
  FOR INSERT
  WITH CHECK ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "kpi_update" ON public."KPI"
  FOR UPDATE
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

-- ============================================================================
-- KPI ENTRY POLICIES
-- ============================================================================

CREATE POLICY "kpi_entry_select" ON public."KPIEntry"
  FOR SELECT
  USING ("kpiId" IN (
    SELECT id FROM public."KPI"
    WHERE "orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid())
  ));

CREATE POLICY "kpi_entry_insert" ON public."KPIEntry"
  FOR INSERT
  WITH CHECK ("kpiId" IN (
    SELECT id FROM public."KPI"
    WHERE "orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid())
  ));

-- ============================================================================
-- SOP POLICIES
-- ============================================================================

CREATE POLICY "sop_category_select" ON public."SOPCategory"
  FOR SELECT
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "sop_select" ON public."SOP"
  FOR SELECT
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "sop_insert" ON public."SOP"
  FOR INSERT
  WITH CHECK ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "sop_update" ON public."SOP"
  FOR UPDATE
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

-- ============================================================================
-- PROJECT & TASK POLICIES
-- ============================================================================

CREATE POLICY "project_select" ON public."Project"
  FOR SELECT
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "project_insert" ON public."Project"
  FOR INSERT
  WITH CHECK ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "task_select" ON public."Task"
  FOR SELECT
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "task_insert" ON public."Task"
  FOR INSERT
  WITH CHECK ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "task_update" ON public."Task"
  FOR UPDATE
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

-- ============================================================================
-- AUDIT LOG POLICIES
-- ============================================================================

-- Append-only: no updates, no deletes
-- Only reads for org members
CREATE POLICY "audit_log_select" ON public."AuditLog"
  FOR SELECT
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "audit_log_insert" ON public."AuditLog"
  FOR INSERT
  WITH CHECK ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

-- ============================================================================
-- CRM POLICIES
-- ============================================================================

CREATE POLICY "contact_select" ON public."Contact"
  FOR SELECT
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "contact_insert" ON public."Contact"
  FOR INSERT
  WITH CHECK ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "contact_update" ON public."Contact"
  FOR UPDATE
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "deal_select" ON public."Deal"
  FOR SELECT
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "deal_insert" ON public."Deal"
  FOR INSERT
  WITH CHECK ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "deal_update" ON public."Deal"
  FOR UPDATE
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

-- ============================================================================
-- INVOICING POLICIES
-- ============================================================================

CREATE POLICY "invoice_select" ON public."Invoice"
  FOR SELECT
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "invoice_insert" ON public."Invoice"
  FOR INSERT
  WITH CHECK ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "invoice_update" ON public."Invoice"
  FOR UPDATE
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

-- ============================================================================
-- STRATEGIC PLANNING POLICIES
-- ============================================================================

CREATE POLICY "vision_select" ON public."Vision"
  FOR SELECT
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "vision_insert" ON public."Vision"
  FOR INSERT
  WITH CHECK ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "vision_update" ON public."Vision"
  FOR UPDATE
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "okr_select" ON public."OKR"
  FOR SELECT
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "okr_insert" ON public."OKR"
  FOR INSERT
  WITH CHECK ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "okr_update" ON public."OKR"
  FOR UPDATE
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

-- ============================================================================
-- CASE MANAGEMENT POLICIES (Nonprofit)
-- ============================================================================

CREATE POLICY "case_client_select" ON public."CaseClient"
  FOR SELECT
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "case_client_insert" ON public."CaseClient"
  FOR INSERT
  WITH CHECK ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "case_note_select" ON public."CaseNote"
  FOR SELECT
  USING ("clientId" IN (
    SELECT id FROM public."CaseClient"
    WHERE "orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid())
  ));

CREATE POLICY "case_note_insert" ON public."CaseNote"
  FOR INSERT
  WITH CHECK ("clientId" IN (
    SELECT id FROM public."CaseClient"
    WHERE "orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid())
  ));

-- Case notes are immutable after 24 hours (enforce in application)
-- No update/delete policy for case notes

-- ============================================================================
-- TRAINING POLICIES
-- ============================================================================

CREATE POLICY "training_program_select" ON public."TrainingProgram"
  FOR SELECT
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "cohort_select" ON public."Cohort"
  FOR SELECT
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "participant_select" ON public."Participant"
  FOR SELECT
  USING ("cohortId" IN (
    SELECT id FROM public."Cohort"
    WHERE "orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid())
  ));

-- ============================================================================
-- AI/CONVERSATION POLICIES
-- ============================================================================

CREATE POLICY "conversation_history_select" ON public."ConversationHistory"
  FOR SELECT
  USING ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "conversation_history_insert" ON public."ConversationHistory"
  FOR INSERT
  WITH CHECK ("orgId" IN (SELECT "orgId" FROM public."OrganizationMember" WHERE "userId" = auth.uid()));

CREATE POLICY "ai_usage_log_insert" ON public."AIUsageLog"
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS "idx_organization_member_user_id" ON public."OrganizationMember"("userId");
CREATE INDEX IF NOT EXISTS "idx_organization_member_org_id" ON public."OrganizationMember"("orgId");
CREATE INDEX IF NOT EXISTS "idx_audit_log_org_id" ON public."AuditLog"("orgId");
CREATE INDEX IF NOT EXISTS "idx_audit_log_created_at" ON public."AuditLog"("createdAt");
CREATE INDEX IF NOT EXISTS "idx_task_org_id" ON public."Task"("orgId");
CREATE INDEX IF NOT EXISTS "idx_task_assignee_id" ON public."Task"("assigneeId");
CREATE INDEX IF NOT EXISTS "idx_kpi_org_id" ON public."KPI"("orgId");
CREATE INDEX IF NOT EXISTS "idx_sop_org_id" ON public."SOP"("orgId");
CREATE INDEX IF NOT EXISTS "idx_project_org_id" ON public."Project"("orgId");
CREATE INDEX IF NOT EXISTS "idx_invoice_org_id" ON public."Invoice"("orgId");

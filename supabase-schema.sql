-- Doxa ClarityHub Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  email TEXT NOT NULL,
  plan TEXT DEFAULT 'growth', -- starter, growth, enterprise
  subscription_status TEXT DEFAULT 'active', -- active, cancelled, past_due
  next_billing_date TIMESTAMP,
  logo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Team Members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'member', -- admin, manager, member
  status TEXT DEFAULT 'pending', -- pending, active, inactive
  created_at TIMESTAMP DEFAULT NOW()
);

-- Assessments table
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL, -- business_health, operations, technology, employee
  title TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed
  progress_percent INTEGER DEFAULT 0,
  score INTEGER,
  report_url TEXT,
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  phase TEXT, -- discover, analyze, design, implement, optimize
  status TEXT DEFAULT 'active', -- active, paused, completed
  due_date TIMESTAMP,
  progress_percent INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed
  assigned_to UUID REFERENCES public.team_members(id),
  due_date TIMESTAMP,
  priority TEXT DEFAULT 'medium', -- low, medium, high
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  document_type TEXT, -- assessment_report, gap_analysis, blueprint, sop, policy
  file_url TEXT,
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- KPI Definitions table
CREATE TABLE IF NOT EXISTS public.kpis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- revenue, efficiency, quality, growth
  target_value NUMERIC,
  current_value NUMERIC,
  unit TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activity Log table
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.team_members(id),
  action TEXT NOT NULL,
  entity_type TEXT, -- project, assessment, document, task
  entity_id UUID,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Clients: Users can only see their own client
CREATE POLICY "Users can view their own client"
  ON public.clients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own client"
  ON public.clients FOR UPDATE
  USING (auth.uid() = user_id);

-- Team Members: Team members can see others in their organization
CREATE POLICY "Team members can view their org's team"
  ON public.team_members FOR SELECT
  USING (client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  ));

-- Assessments: Only the client's team can view
CREATE POLICY "Team can view their assessments"
  ON public.assessments FOR SELECT
  USING (client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  ));

-- Projects: Only the client's team can view
CREATE POLICY "Team can view their projects"
  ON public.projects FOR SELECT
  USING (client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  ));

-- Tasks: Only the client's team can view
CREATE POLICY "Team can view their tasks"
  ON public.tasks FOR SELECT
  USING (project_id IN (
    SELECT id FROM public.projects
    WHERE client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  ));

-- Documents: Only the client's team can view
CREATE POLICY "Team can view their documents"
  ON public.documents FOR SELECT
  USING (client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  ));

-- KPIs: Only the client's team can view
CREATE POLICY "Team can view their KPIs"
  ON public.kpis FOR SELECT
  USING (client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  ));

-- Activity Log: Only the client's team can view
CREATE POLICY "Team can view their activity"
  ON public.activity_log FOR SELECT
  USING (client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_team_members_client_id ON public.team_members(client_id);
CREATE INDEX idx_assessments_client_id ON public.assessments(client_id);
CREATE INDEX idx_projects_client_id ON public.projects(client_id);
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_documents_client_id ON public.documents(client_id);
CREATE INDEX idx_kpis_client_id ON public.kpis(client_id);
CREATE INDEX idx_activity_log_client_id ON public.activity_log(client_id);

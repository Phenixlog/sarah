-- Nouvelle table pour les tâches de projets (séparée des todos perso)
CREATE TABLE IF NOT EXISTS public.project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority TEXT NOT NULL DEFAULT 'p2' CHECK (priority IN ('p1', 'p2', 'p3')),
  due_date DATE,
  assigned_to UUID REFERENCES public.profiles(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON public.project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_assigned_to ON public.project_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_project_tasks_status ON public.project_tasks(status);

-- Enable RLS
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view tasks of their projects" ON public.project_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id
      AND (owner_id = auth.uid() OR auth.uid() = ANY(team_members))
    )
  );

CREATE POLICY "Project members can create tasks" ON public.project_tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id
      AND (owner_id = auth.uid() OR auth.uid() = ANY(team_members))
    )
  );

CREATE POLICY "Project members can update tasks" ON public.project_tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id
      AND (owner_id = auth.uid() OR auth.uid() = ANY(team_members))
    )
  );

CREATE POLICY "Project members can delete tasks" ON public.project_tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id
      AND (owner_id = auth.uid() OR auth.uid() = ANY(team_members))
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.project_tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Supprimer la colonne project_id de la table todos
-- (On garde les todos complètement indépendants)
-- Note: Cette migration est optionnelle si vous avez déjà des données
-- ALTER TABLE public.todos DROP COLUMN IF EXISTS project_id;

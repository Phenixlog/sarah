-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create todos table
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority TEXT NOT NULL DEFAULT 'p2' CHECK (priority IN ('p1', 'p2', 'p3')),
  due_date DATE,
  estimated_time INTEGER,
  project_id UUID,
  tags TEXT[] DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'on_track' CHECK (status IN ('on_track', 'at_risk', 'blocked', 'paused', 'completed')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_members UUID[] DEFAULT '{}',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create project_documents table
CREATE TABLE IF NOT EXISTS public.project_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create project_milestones table
CREATE TABLE IF NOT EXISTS public.project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create project_notes table
CREATE TABLE IF NOT EXISTS public.project_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key for project_id in todos
ALTER TABLE public.todos
  ADD CONSTRAINT fk_todos_project
  FOREIGN KEY (project_id)
  REFERENCES public.projects(id)
  ON DELETE SET NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON public.todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_project_id ON public.todos(project_id);
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON public.todos(due_date);
CREATE INDEX IF NOT EXISTS idx_todos_status ON public.todos(status);
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_project_documents_project_id ON public.project_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON public.project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_project_notes_project_id ON public.project_notes(project_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_notes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Todos policies
CREATE POLICY "Users can view own todos" ON public.todos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own todos" ON public.todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos" ON public.todos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos" ON public.todos
  FOR DELETE USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Users can view projects they own or are team members of" ON public.projects
  FOR SELECT USING (
    auth.uid() = owner_id OR
    auth.uid() = ANY(team_members)
  );

CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Project owners can update projects" ON public.projects
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Project owners can delete projects" ON public.projects
  FOR DELETE USING (auth.uid() = owner_id);

-- Project documents policies
CREATE POLICY "Users can view documents of their projects" ON public.project_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id
      AND (owner_id = auth.uid() OR auth.uid() = ANY(team_members))
    )
  );

CREATE POLICY "Users can upload documents to their projects" ON public.project_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id
      AND (owner_id = auth.uid() OR auth.uid() = ANY(team_members))
    )
  );

CREATE POLICY "Users can delete documents they uploaded" ON public.project_documents
  FOR DELETE USING (auth.uid() = uploaded_by);

-- Project milestones policies
CREATE POLICY "Users can view milestones of their projects" ON public.project_milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id
      AND (owner_id = auth.uid() OR auth.uid() = ANY(team_members))
    )
  );

CREATE POLICY "Project owners can manage milestones" ON public.project_milestones
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id
      AND owner_id = auth.uid()
    )
  );

-- Project notes policies
CREATE POLICY "Users can view notes of their projects" ON public.project_notes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id
      AND (owner_id = auth.uid() OR auth.uid() = ANY(team_members))
    )
  );

CREATE POLICY "Users can create notes in their projects" ON public.project_notes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id
      AND (owner_id = auth.uid() OR auth.uid() = ANY(team_members))
    )
  );

CREATE POLICY "Users can update own notes" ON public.project_notes
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own notes" ON public.project_notes
  FOR DELETE USING (auth.uid() = author_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.todos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.project_milestones
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.project_notes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create Storage bucket for project documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-documents', 'project-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for project documents
CREATE POLICY "Users can upload documents to their projects"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view documents of their projects"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'project-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their uploaded documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

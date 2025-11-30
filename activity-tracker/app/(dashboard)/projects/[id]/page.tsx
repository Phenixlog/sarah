import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProjectHeader } from '@/components/projects/project-header'
import { ProjectProgress } from '@/components/projects/project-progress'
import dynamic from 'next/dynamic'

// Lazy load heavy tab components - they're only rendered when tabs are clicked
const ProjectMilestones = dynamic(() => import('@/components/projects/project-milestones').then(mod => ({ default: mod.ProjectMilestones })), {
  loading: () => <div className="animate-pulse bg-surface h-32 rounded" />
})
const ProjectDocuments = dynamic(() => import('@/components/projects/project-documents').then(mod => ({ default: mod.ProjectDocuments })), {
  loading: () => <div className="animate-pulse bg-surface h-32 rounded" />
})
const ProjectNotes = dynamic(() => import('@/components/projects/project-notes').then(mod => ({ default: mod.ProjectNotes })), {
  loading: () => <div className="animate-pulse bg-surface h-32 rounded" />
})
const ProjectTasks = dynamic(() => import('@/components/projects/project-tasks').then(mod => ({ default: mod.ProjectTasks })), {
  loading: () => <div className="animate-pulse bg-surface h-32 rounded" />
})

// Cache this page and revalidate every 30 seconds
export const revalidate = 30

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: project } = await supabase
    .from('projects')
    .select(`
      *,
      profiles:owner_id (id, full_name, email)
    `)
    .eq('id', id)
    .single()

  if (!project) {
    notFound()
  }

  // Check access
  const hasAccess = project.owner_id === user!.id || project.team_members?.includes(user!.id)
  if (!hasAccess) {
    notFound()
  }

  // Get project members IDs
  const memberIds = [project.owner_id, ...(project.team_members || [])]

  // Parallelize all database queries for faster loading
  const [
    { data: milestones },
    { data: documents },
    { data: notes },
    { data: tasks },
    { data: members }
  ] = await Promise.all([
    // Get milestones
    supabase
      .from('project_milestones')
      .select('*')
      .eq('project_id', project.id)
      .order('due_date', { ascending: true }),

    // Get documents
    supabase
      .from('project_documents')
      .select(`
        *,
        profiles:uploaded_by (full_name)
      `)
      .eq('project_id', project.id)
      .order('created_at', { ascending: false }),

    // Get notes
    supabase
      .from('project_notes')
      .select(`
        *,
        profiles:author_id (full_name)
      `)
      .eq('project_id', project.id)
      .order('created_at', { ascending: false }),

    // Get project tasks with assigned user info
    supabase
      .from('project_tasks')
      .select(`
        *,
        assigned_user:assigned_to (id, full_name, email)
      `)
      .eq('project_id', project.id)
      .order('priority', { ascending: true })
      .order('created_at', { ascending: false }),

    // Get project members (owner + team members)
    supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', memberIds)
  ])

  const isOwner = project.owner_id === user!.id

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} isOwner={isOwner} />

      <ProjectProgress project={project} isOwner={isOwner} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-5 bg-surface-elevated">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="todos">Tâches</TabsTrigger>
          <TabsTrigger value="milestones">Jalons</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {project.description && (
                  <div>
                    <div className="text-text-secondary mb-1">Description</div>
                    <div className="text-text-primary">{project.description}</div>
                  </div>
                )}
                <div>
                  <div className="text-text-secondary mb-1">Chef de projet</div>
                  <div className="text-text-primary">
                    {(project.profiles as any)?.full_name || (project.profiles as any)?.email}
                  </div>
                </div>
                {project.start_date && (
                  <div>
                    <div className="text-text-secondary mb-1">Date de début</div>
                    <div className="text-text-primary">
                      {new Date(project.start_date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                )}
                {project.end_date && (
                  <div>
                    <div className="text-text-secondary mb-1">Date de fin prévue</div>
                    <div className="text-text-primary">
                      {new Date(project.end_date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Tâches liées</span>
                  <span className="text-lg font-semibold text-text-primary">
                    {tasks?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Jalons</span>
                  <span className="text-lg font-semibold text-text-primary">
                    {milestones?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Documents</span>
                  <span className="text-lg font-semibold text-text-primary">
                    {documents?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Notes</span>
                  <span className="text-lg font-semibold text-text-primary">
                    {notes?.length || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="todos" className="mt-6">
          <ProjectTasks
            projectId={project.id}
            tasks={tasks || []}
            members={members || []}
            currentUserId={user!.id}
          />
        </TabsContent>

        <TabsContent value="milestones" className="mt-6">
          <ProjectMilestones projectId={project.id} milestones={milestones || []} />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <ProjectDocuments projectId={project.id} documents={documents || []} />
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <ProjectNotes projectId={project.id} notes={notes || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

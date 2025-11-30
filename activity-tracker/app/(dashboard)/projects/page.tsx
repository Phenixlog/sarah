import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import dynamic from 'next/dynamic'

// Lazy load heavy dialog component for better initial page load
const CreateProjectDialog = dynamic(() => import('@/components/projects/create-project-dialog').then(mod => ({ default: mod.CreateProjectDialog })), {
  ssr: false,
  loading: () => <div className="h-10 w-10 animate-pulse bg-surface rounded" />
})

// Cache this page and revalidate every 60 seconds
export const revalidate = 60

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from('projects')
    .select(`
      *,
      profiles:owner_id (full_name, email)
    `)
    .or(`owner_id.eq.${user!.id},team_members.cs.{${user!.id}}`)
    .order('updated_at', { ascending: false })

  const statusColors = {
    on_track: 'success',
    at_risk: 'warning',
    blocked: 'danger',
    paused: 'default',
    completed: 'success',
  }

  const statusLabels = {
    on_track: 'On Track',
    at_risk: 'At Risk',
    blocked: 'Bloqué',
    paused: 'En Pause',
    completed: 'Terminé',
  }

  const statusIcons = {
    on_track: '🟢',
    at_risk: '🟡',
    blocked: '🔴',
    paused: '⚪',
    completed: '✅',
  }

  const activeProjects = projects?.filter(p => p.status !== 'completed') || []
  const completedProjects = projects?.filter(p => p.status === 'completed') || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Projets</h1>
          <p className="text-text-secondary">
            Gérez et suivez vos projets
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-text-primary">
              {activeProjects.length}
            </div>
            <div className="text-sm text-text-secondary">Projets actifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">
              {activeProjects.filter(p => p.status === 'on_track').length}
            </div>
            <div className="text-sm text-text-secondary">On track</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">
              {activeProjects.filter(p => p.status === 'at_risk').length}
            </div>
            <div className="text-sm text-text-secondary">At risk</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-text-primary">
              {completedProjects.length}
            </div>
            <div className="text-sm text-text-secondary">Terminés</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Projects */}
      {activeProjects.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Projets actifs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="hover:border-border-light transition-all cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <span className="text-2xl">
                        {statusIcons[project.status as keyof typeof statusIcons]}
                      </span>
                      <Badge variant={statusColors[project.status as keyof typeof statusColors] as any}>
                        {statusLabels[project.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{project.name}</CardTitle>
                    {project.description && (
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-secondary">Progression</span>
                          <span className="text-text-primary font-medium">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-white h-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-xs text-text-tertiary space-y-1">
                        {project.start_date && (
                          <div>Début: {formatDate(project.start_date)}</div>
                        )}
                        {project.end_date && (
                          <div>Fin prévue: {formatDate(project.end_date)}</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Completed Projects */}
      {completedProjects.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Projets terminés
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="hover:border-border-light transition-all cursor-pointer h-full opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <span className="text-2xl">✅</span>
                      <Badge variant="success">Terminé</Badge>
                    </div>
                    <CardTitle className="text-base">{project.name}</CardTitle>
                    {project.description && (
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-text-tertiary">
                      Terminé le {formatDate(project.updated_at)}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!projects || projects.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-text-secondary mb-4">
              Aucun projet pour le moment
            </p>
            <CreateProjectDialog />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

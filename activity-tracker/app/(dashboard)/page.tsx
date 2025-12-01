import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckSquare, FolderKanban, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { getDaysOld, getAgeConfig } from '@/lib/utils/date-helpers'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const today = new Date().toISOString().split('T')[0]

  // Run all queries in parallel for better performance
  const [
    { data: todayTodos },
    { count: totalTodos },
    { data: activeProjects }
  ] = await Promise.all([
    supabase
      .from('todos')
      .select('*')
      .eq('user_id', user!.id)
      .eq('due_date', today)
      .neq('status', 'done')
      .order('priority', { ascending: true })
      .limit(5),

    supabase
      .from('todos')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user!.id)
      .neq('status', 'done'),

    supabase
      .from('projects')
      .select('*')
      .or(`owner_id.eq.${user!.id},team_members.cs.{${user!.id}}`)
      .neq('status', 'completed')
      .order('updated_at', { ascending: false })
      .limit(3)
  ])

  const priorityColors = {
    p1: 'danger',
    p2: 'warning',
    p3: 'default',
  }

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

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-text-secondary text-base">Vue d'ensemble de votre activité</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:border-primary/30 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-text-secondary">
                Tâches du jour
              </CardTitle>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-text-primary">
              {todayTodos?.length || 0}
            </div>
            <p className="text-xs text-text-tertiary mt-1">Tâches à faire aujourd'hui</p>
          </CardContent>
        </Card>

        <Card className="hover:border-accent-cyan/30 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-text-secondary">
                Tâches actives
              </CardTitle>
              <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-accent-cyan" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-text-primary">
              {totalTodos || 0}
            </div>
            <p className="text-xs text-text-tertiary mt-1">Total des tâches en cours</p>
          </CardContent>
        </Card>

        <Card className="hover:border-accent-pink/30 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-text-secondary">
                Projets actifs
              </CardTitle>
              <div className="w-8 h-8 rounded-lg bg-accent-pink/10 flex items-center justify-center">
                <FolderKanban className="w-4 h-4 text-accent-pink" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-text-primary">
              {activeProjects?.length || 0}
            </div>
            <p className="text-xs text-text-tertiary mt-1">Projets en cours</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Todos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Tâches du jour</h2>
          <Link
            href="/todos"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Voir tout →
          </Link>
        </div>

        {todayTodos && todayTodos.length > 0 ? (
          <div className="space-y-3">
            {todayTodos.map((todo) => (
              <Card key={todo.id} className="hover:border-border-light transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-text-primary mb-1">{todo.title}</h3>
                      {todo.description && (
                        <p className="text-sm text-text-secondary line-clamp-1">
                          {todo.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={priorityColors[todo.priority as keyof typeof priorityColors] as any}>
                        {todo.priority.toUpperCase()}
                      </Badge>
                      {todo.status === 'done' && (
                        <Badge variant="success">Terminé</Badge>
                      )}
                      {/* Task Age Indicator */}
                      {(() => {
                        const daysOld = getDaysOld(todo.created_at)
                        const ageConfig = getAgeConfig(daysOld)
                        return (
                          <Badge variant={ageConfig.variant} className="gap-1">
                            <Clock className="w-3 h-3" />
                            {ageConfig.label}
                          </Badge>
                        )
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-text-secondary">
              Aucune tâche pour aujourd'hui
            </CardContent>
          </Card>
        )}
      </div>

      {/* Active Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Projets actifs</h2>
          <Link
            href="/projects"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Voir tout →
          </Link>
        </div>

        {activeProjects && activeProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="hover:border-border-light transition-all cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-base">{project.name}</CardTitle>
                      <Badge variant={statusColors[project.status as keyof typeof statusColors] as any}>
                        {statusLabels[project.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                    {project.description && (
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Progression</span>
                        <span className="text-text-primary font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-white h-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-text-secondary">
              Aucun projet actif
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

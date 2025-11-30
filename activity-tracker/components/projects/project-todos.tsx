'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { ProjectTask, ProjectMember } from '@/types/database'
import { CreateProjectTaskDialog } from './create-project-task-dialog'
import { Copy, User as UserIcon } from 'lucide-react'

interface ProjectTodosProps {
  projectId: string
  tasks: (ProjectTask & { assignee: { full_name: string | null; email: string } | null })[]
  members: (ProjectMember & { profile: { full_name: string | null; email: string } | null })[]
}

export function ProjectTodos({ projectId, tasks, members }: ProjectTodosProps) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const statusColors = {
    todo: 'default',
    in_progress: 'primary',
    done: 'success',
  }

  const statusLabels = {
    todo: 'À faire',
    in_progress: 'En cours',
    done: 'Terminé',
  }

  const handleToggle = async (task: ProjectTask) => {
    const supabase = createClient()
    const newStatus = task.status === 'done' ? 'todo' : 'done'

    await supabase
      .from('project_tasks')
      .update({ status: newStatus })
      .eq('id', task.id)

    router.refresh()
  }

  const handleAddToMyTodo = async (task: ProjectTask) => {
    setLoadingId(task.id)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase.from('todos').insert({
      user_id: user.id,
      title: task.title,
      description: task.description,
      status: 'todo',
      priority: 'p2',
      origin_project_task_id: task.id,
    })

    if (!error) {
      // Optional: Show success message
      alert('Tâche ajoutée à votre liste personnelle !')
    } else {
      alert('Erreur lors de l\'ajout de la tâche.')
    }
    setLoadingId(null)
  }

  const doneCount = tasks.filter((t) => t.status === 'done').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Tâches du projet ({doneCount}/{tasks.length} terminées)
          </h3>
          <p className="text-sm text-text-secondary">
            Gérez les tâches et assignez-les aux membres
          </p>
        </div>
        <CreateProjectTaskDialog projectId={projectId} members={members} />
      </div>

      {tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className={`hover:border-border-light transition-colors ${task.status === 'done' ? 'opacity-60' : ''
                }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={task.status === 'done'}
                    onCheckedChange={() => handleToggle(task)}
                    className="mt-1"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3
                        className={`font-medium text-text-primary ${task.status === 'done' ? 'line-through' : ''
                          }`}
                      >
                        {task.title}
                      </h3>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant={statusColors[task.status as keyof typeof statusColors] as any}>
                          {statusLabels[task.status as keyof typeof statusLabels]}
                        </Badge>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-2 text-text-secondary hover:text-primary"
                          onClick={() => handleAddToMyTodo(task)}
                          disabled={loadingId === task.id}
                        >
                          <Copy className="w-4 h-4" />
                          <span className="sr-only sm:not-sr-only sm:inline-block text-xs">
                            Ajouter à mes tâches
                          </span>
                        </Button>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-text-tertiary">
                      {task.due_date && (
                        <div>
                          Échéance: {new Date(task.due_date).toLocaleDateString('fr-FR')}
                        </div>
                      )}

                      {task.assignee && (
                        <div className="flex items-center gap-1 text-primary">
                          <UserIcon className="w-3 h-3" />
                          {task.assignee.full_name || task.assignee.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-text-secondary">
            Aucune tâche dans ce projet
          </CardContent>
        </Card>
      )}
    </div>
  )
}

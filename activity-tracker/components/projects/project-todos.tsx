'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Todo } from '@/types/database'

export function ProjectTodos({ projectId, todos }: { projectId: string; todos: Todo[] }) {
  const router = useRouter()

  const priorityColors = {
    p1: 'danger',
    p2: 'warning',
    p3: 'default',
  }

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

  const handleToggle = async (todo: Todo) => {
    const supabase = createClient()
    const newStatus = todo.status === 'done' ? 'todo' : 'done'
    const completed_at = newStatus === 'done' ? new Date().toISOString() : null

    await supabase
      .from('todos')
      .update({ status: newStatus, completed_at })
      .eq('id', todo.id)

    router.refresh()
  }

  const todoCount = todos.filter((t) => t.status !== 'done').length
  const doneCount = todos.filter((t) => t.status === 'done').length

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-text-primary">
          Tâches liées ({doneCount}/{todos.length} terminées)
        </h3>
        <p className="text-sm text-text-secondary">
          Tâches associées à ce projet
        </p>
      </div>

      {todos.length > 0 ? (
        <div className="space-y-3">
          {todos.map((todo) => (
            <Card
              key={todo.id}
              className={`hover:border-border-light transition-colors ${
                todo.status === 'done' ? 'opacity-60' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={todo.status === 'done'}
                    onCheckedChange={() => handleToggle(todo)}
                    className="mt-1"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3
                        className={`font-medium text-text-primary ${
                          todo.status === 'done' ? 'line-through' : ''
                        }`}
                      >
                        {todo.title}
                      </h3>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant={priorityColors[todo.priority as keyof typeof priorityColors] as any}>
                          {todo.priority.toUpperCase()}
                        </Badge>
                        {todo.status !== 'todo' && (
                          <Badge variant={statusColors[todo.status as keyof typeof statusColors] as any}>
                            {statusLabels[todo.status as keyof typeof statusLabels]}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {todo.description && (
                      <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                        {todo.description}
                      </p>
                    )}

                    {todo.due_date && (
                      <div className="text-xs text-text-tertiary">
                        Échéance: {new Date(todo.due_date).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-text-secondary">
            Aucune tâche liée à ce projet
          </CardContent>
        </Card>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Calendar, Trash2, Edit, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { EditTodoDialog } from './edit-todo-dialog'
import type { Todo, Project } from '@/types/database'

interface TodoListProps {
  todos: (Todo & { projects?: Project | null })[]
  projects: Pick<Project, 'id' | 'name'>[]
  emptyMessage?: string
}

export function TodoList({ todos, projects, emptyMessage = 'Aucune tâche' }: TodoListProps) {
  const router = useRouter()
  const [editingTodo, setEditingTodo] = useState<(Todo & { projects?: Project | null }) | null>(null)

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

  const handleDelete = async (todoId: string) => {
    const supabase = createClient()
    await supabase.from('todos').delete().eq('id', todoId)
    router.refresh()
  }

  const handleMoveToTomorrow = async (todo: Todo) => {
    const supabase = createClient()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    await supabase
      .from('todos')
      .update({ due_date: tomorrow.toISOString().split('T')[0] })
      .eq('id', todo.id)

    router.refresh()
  }

  if (todos.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-text-secondary">
          {emptyMessage}
        </CardContent>
      </Card>
    )
  }

  return (
    <>
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

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingTodo(todo)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMoveToTomorrow(todo)}>
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Reporter à demain
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(todo.id)}
                            className="text-danger focus:text-danger"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {todo.description && (
                    <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                      {todo.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-text-tertiary">
                    {todo.due_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(todo.due_date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    )}
                    {todo.projects && (
                      <Badge variant="default" className="text-xs">
                        {todo.projects.name}
                      </Badge>
                    )}
                    {todo.tags && todo.tags.length > 0 && (
                      <div className="flex gap-1">
                        {todo.tags.map((tag) => (
                          <span key={tag} className="text-text-tertiary">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingTodo && (
        <EditTodoDialog
          todo={editingTodo}
          projects={projects}
          open={!!editingTodo}
          onOpenChange={(open) => !open && setEditingTodo(null)}
        />
      )}
    </>
  )
}

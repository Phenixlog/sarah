'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import type { Todo } from '@/types/database'

export function ProjectTodos({ projectId, todos }: { projectId: string; todos: Todo[] }) {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'p2',
    due_date: new Date().toISOString().split('T')[0],
    tags: '',
  })

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const tags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t)

    const { error } = await supabase.from('todos').insert({
      user_id: user!.id,
      title: formData.title,
      description: formData.description || null,
      priority: formData.priority as 'p1' | 'p2' | 'p3',
      due_date: formData.due_date || null,
      project_id: projectId,
      tags,
    })

    if (!error) {
      setFormData({
        title: '',
        description: '',
        priority: 'p2',
        due_date: new Date().toISOString().split('T')[0],
        tags: '',
      })
      setCreateOpen(false)
      router.refresh()
    }

    setLoading(false)
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTodo) return

    setLoading(true)
    const supabase = createClient()

    const tags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t)

    const { error } = await supabase
      .from('todos')
      .update({
        title: formData.title,
        description: formData.description || null,
        priority: formData.priority as 'p1' | 'p2' | 'p3',
        due_date: formData.due_date || null,
        tags,
      })
      .eq('id', editingTodo.id)

    if (!error) {
      setEditOpen(false)
      setEditingTodo(null)
      router.refresh()
    }

    setLoading(false)
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

  const openEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setFormData({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      due_date: todo.due_date || '',
      tags: todo.tags?.join(', ') || '',
    })
    setEditOpen(true)
  }

  const todoCount = todos.filter((t) => t.status !== 'done').length
  const doneCount = todos.filter((t) => t.status === 'done').length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Tâches du projet ({doneCount}/{todos.length} terminées)
          </h3>
          <p className="text-sm text-text-secondary">
            Créez et gérez les tâches de ce projet
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Créer une tâche
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer une tâche</DialogTitle>
              <DialogDescription>
                Ajoutez une nouvelle tâche à ce projet
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Titre *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Titre de la tâche"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description (optionnel)"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Priorité
                  </label>
                  <Select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="p1">P1 - Haute</option>
                    <option value="p2">P2 - Moyenne</option>
                    <option value="p3">P3 - Basse</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Échéance
                  </label>
                  <Input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Tags
                </label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Création...' : 'Créer'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(todo)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
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
            Aucune tâche pour ce projet. Créez-en une !
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier la tâche</DialogTitle>
            <DialogDescription>
              Modifiez les détails de la tâche
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Titre *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Titre de la tâche"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description (optionnel)"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Priorité
                </label>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="p1">P1 - Haute</option>
                  <option value="p2">P2 - Moyenne</option>
                  <option value="p3">P3 - Basse</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Échéance
                </label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Tags
              </label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

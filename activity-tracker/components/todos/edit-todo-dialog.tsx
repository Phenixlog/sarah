'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import type { Todo, Project } from '@/types/database'

interface EditTodoDialogProps {
  todo: Todo & { projects?: Project | null }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditTodoDialog({ todo, open, onOpenChange }: EditTodoDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority,
    status: todo.status,
    due_date: todo.due_date || '',
    tags: todo.tags?.join(', ') || '',
  })

  useEffect(() => {
    setFormData({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      status: todo.status,
      due_date: todo.due_date || '',
      tags: todo.tags?.join(', ') || '',
    })
  }, [todo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        status: formData.status as 'todo' | 'in_progress' | 'done',
        due_date: formData.due_date || null,
        tags,
        completed_at: formData.status === 'done' ? new Date().toISOString() : null,
      })
      .eq('id', todo.id)

    if (!error) {
      onOpenChange(false)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier la tâche</DialogTitle>
          <DialogDescription>
            Modifiez les détails de votre tâche
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-2">
              Titre *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Titre de la tâche"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description de la tâche (optionnel)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-text-primary mb-2">
                Priorité
              </label>
              <Select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              >
                <option value="p1">P1 - Haute</option>
                <option value="p2">P2 - Moyenne</option>
                <option value="p3">P3 - Basse</option>
              </Select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-text-primary mb-2">
                Statut
              </label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="todo">À faire</option>
                <option value="in_progress">En cours</option>
                <option value="done">Terminé</option>
              </Select>
            </div>
          </div>

          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-text-primary mb-2">
              Date d&apos;échéance
            </label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            />
          </div>



          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-text-primary mb-2">
              Tags
            </label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="tag1, tag2, tag3"
            />
            <p className="mt-1 text-xs text-text-tertiary">
              Séparez les tags par des virgules
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

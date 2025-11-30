'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Plus } from 'lucide-react'
export function CreateTodoDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'p2',
    due_date: new Date().toISOString().split('T')[0],
    tags: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
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
      setOpen(false)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle tâche
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Créer une tâche</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle tâche à votre liste
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
              <label htmlFor="due_date" className="block text-sm font-medium text-text-primary mb-2">
                Date
              </label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
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
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

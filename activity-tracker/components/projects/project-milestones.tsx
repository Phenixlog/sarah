'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2 } from 'lucide-react'
import type { ProjectMilestone } from '@/types/database'

export function ProjectMilestones({
  projectId,
  milestones,
}: {
  projectId: string
  milestones: ProjectMilestone[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.from('project_milestones').insert({
      project_id: projectId,
      title: formData.title,
      description: formData.description || null,
      due_date: formData.due_date,
    })

    if (!error) {
      setFormData({ title: '', description: '', due_date: '' })
      setOpen(false)
      router.refresh()
    }

    setLoading(false)
  }

  const handleToggle = async (milestone: ProjectMilestone) => {
    const supabase = createClient()
    await supabase
      .from('project_milestones')
      .update({
        completed: !milestone.completed,
        completed_at: !milestone.completed ? new Date().toISOString() : null,
      })
      .eq('id', milestone.id)

    router.refresh()
  }

  const handleDelete = async (milestoneId: string) => {
    const supabase = createClient()
    await supabase.from('project_milestones').delete().eq('id', milestoneId)
    router.refresh()
  }

  const completedCount = milestones.filter((m) => m.completed).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Jalons ({completedCount}/{milestones.length})
          </h3>
          <p className="text-sm text-text-secondary">
            Suivez les étapes clés de votre projet
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un jalon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un jalon</DialogTitle>
              <DialogDescription>
                Ajoutez une étape clé à votre projet
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
                  placeholder="Nom du jalon"
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

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Date d&apos;échéance *
                </label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  required
                />
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
      </div>

      {milestones.length > 0 ? (
        <div className="space-y-3">
          {milestones.map((milestone) => {
            const isOverdue = !milestone.completed && new Date(milestone.due_date) < new Date()

            return (
              <Card
                key={milestone.id}
                className={milestone.completed ? 'opacity-60' : ''}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={milestone.completed}
                      onCheckedChange={() => handleToggle(milestone)}
                      className="mt-1"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4
                          className={`font-medium text-text-primary ${
                            milestone.completed ? 'line-through' : ''
                          }`}
                        >
                          {milestone.title}
                        </h4>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isOverdue && (
                            <Badge variant="danger">En retard</Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDelete(milestone.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {milestone.description && (
                        <p className="text-sm text-text-secondary mb-2">
                          {milestone.description}
                        </p>
                      )}

                      <div className="text-xs text-text-tertiary">
                        Échéance: {new Date(milestone.due_date).toLocaleDateString('fr-FR')}
                        {milestone.completed && milestone.completed_at && (
                          <span className="ml-2">
                            • Terminé le {new Date(milestone.completed_at).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-text-secondary">
            Aucun jalon pour ce projet
          </CardContent>
        </Card>
      )}
    </div>
  )
}

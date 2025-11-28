'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Edit, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Project } from '@/types/database'

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

export function ProjectHeader({ project, isOwner }: { project: Project; isOwner: boolean }) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description || '',
    status: project.status,
    start_date: project.start_date || '',
    end_date: project.end_date || '',
  })

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('projects')
      .update({
        name: formData.name,
        description: formData.description || null,
        status: formData.status,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      })
      .eq('id', project.id)

    if (!error) {
      setEditOpen(false)
      router.refresh()
    }

    setLoading(false)
  }

  const handleDelete = async () => {
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.from('projects').delete().eq('id', project.id)

    if (!error) {
      router.push('/projects')
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux projets
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-text-primary">{project.name}</h1>
            <Badge variant={statusColors[project.status as keyof typeof statusColors] as any}>
              {statusLabels[project.status as keyof typeof statusLabels]}
            </Badge>
          </div>

          {project.description && (
            <p className="text-text-secondary">{project.description}</p>
          )}
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
            <Button variant="outline" size="sm" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le projet</DialogTitle>
            <DialogDescription>
              Modifiez les informations de votre projet
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                Nom du projet *
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                rows={3}
              />
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
                <option value="on_track">🟢 On Track</option>
                <option value="at_risk">🟡 At Risk</option>
                <option value="blocked">🔴 Bloqué</option>
                <option value="paused">⚪ En Pause</option>
                <option value="completed">✅ Terminé</option>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-text-primary mb-2">
                  Date de début
                </label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-text-primary mb-2">
                  Date de fin
                </label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
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

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le projet</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              Annuler
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={loading}>
              {loading ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

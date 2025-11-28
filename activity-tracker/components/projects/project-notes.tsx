'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Trash2 } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import type { ProjectNote } from '@/types/database'

export function ProjectNotes({
  projectId,
  notes,
}: {
  projectId: string
  notes: (ProjectNote & { profiles?: any })[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase.from('project_notes').insert({
      project_id: projectId,
      content,
      author_id: user!.id,
    })

    if (!error) {
      setContent('')
      setOpen(false)
      router.refresh()
    }

    setLoading(false)
  }

  const handleDelete = async (noteId: string) => {
    const supabase = createClient()
    await supabase.from('project_notes').delete().eq('id', noteId)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Notes ({notes.length})
          </h3>
          <p className="text-sm text-text-secondary">
            Journal de bord et notes du projet
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Ajouter une note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Créer une note</DialogTitle>
              <DialogDescription>
                Ajoutez une entrée au journal de bord du projet
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Contenu *
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Écrivez votre note ici..."
                  rows={6}
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

      {notes.length > 0 ? (
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="font-medium text-text-primary text-sm">
                      {note.profiles?.full_name || 'Utilisateur'}
                    </div>
                    <div className="text-xs text-text-tertiary">
                      {formatDateTime(note.created_at)}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDelete(note.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-sm text-text-primary whitespace-pre-wrap">
                  {note.content}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-text-secondary">
            Aucune note pour ce projet
          </CardContent>
        </Card>
      )}
    </div>
  )
}

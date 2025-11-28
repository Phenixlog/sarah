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

export function CreateProjectDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'on_track',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase.from('projects').insert({
      name: formData.name,
      description: formData.description || null,
      status: formData.status as any,
      owner_id: user!.id,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      progress: 0,
    })

    if (!error) {
      setFormData({
        name: '',
        description: '',
        status: 'on_track',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
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
          Nouveau projet
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un projet</DialogTitle>
          <DialogDescription>
            Créez un nouveau projet et commencez à le suivre
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
              Nom du projet *
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Mon nouveau projet"
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
              placeholder="Description du projet (optionnel)"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-text-primary mb-2">
              Statut initial
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
                Date de fin prévue
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

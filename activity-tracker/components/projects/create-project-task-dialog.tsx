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
import type { ProjectMember } from '@/types/database'

interface CreateProjectTaskDialogProps {
    projectId: string
    members: (ProjectMember & { profile: { full_name: string | null; email: string } | null })[]
}

export function CreateProjectTaskDialog({ projectId, members }: CreateProjectTaskDialogProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'todo',
        assignee_id: '',
        due_date: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const supabase = createClient()

        const { error } = await supabase.from('project_tasks').insert({
            project_id: projectId,
            title: formData.title,
            description: formData.description || null,
            status: formData.status as 'todo' | 'in_progress' | 'done',
            assignee_id: formData.assignee_id || null,
            due_date: formData.due_date || null,
        })

        if (!error) {
            setFormData({
                title: '',
                description: '',
                status: 'todo',
                assignee_id: '',
                due_date: '',
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
                    <DialogTitle>Créer une tâche de projet</DialogTitle>
                    <DialogDescription>
                        Ajoutez une nouvelle tâche au projet
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
                            <label htmlFor="status" className="block text-sm font-medium text-text-primary mb-2">
                                Statut
                            </label>
                            <Select
                                id="status"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="todo">À faire</option>
                                <option value="in_progress">En cours</option>
                                <option value="done">Terminé</option>
                            </Select>
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
                    </div>

                    <div>
                        <label htmlFor="assignee" className="block text-sm font-medium text-text-primary mb-2">
                            Assigné à
                        </label>
                        <Select
                            id="assignee"
                            value={formData.assignee_id}
                            onChange={(e) => setFormData({ ...formData, assignee_id: e.target.value })}
                        >
                            <option value="">Non assigné</option>
                            {members.map((member) => (
                                <option key={member.id} value={member.user_id}>
                                    {member.profile?.full_name || member.profile?.email}
                                </option>
                            ))}
                        </Select>
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

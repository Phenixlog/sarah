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
import { Plus, MoreHorizontal, Edit, Trash2, User, Filter } from 'lucide-react'
import type { ProjectTask, Profile } from '@/types/database'

interface ProjectMember {
  id: string
  full_name: string | null
  email: string
}

interface ProjectTasksProps {
  projectId: string
  tasks: (ProjectTask & { assigned_user?: ProjectMember | null })[]
  members: ProjectMember[]
  currentUserId: string
}

export function ProjectTasks({ projectId, tasks, members, currentUserId }: ProjectTasksProps) {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<ProjectTask | null>(null)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'my'>('all')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'p2',
    status: 'todo',
    due_date: '',
    assigned_to: '',
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

    const { error } = await supabase.from('project_tasks').insert({
      project_id: projectId,
      title: formData.title,
      description: formData.description || null,
      priority: formData.priority as 'p1' | 'p2' | 'p3',
      status: formData.status as 'todo' | 'in_progress' | 'done',
      due_date: formData.due_date || null,
      assigned_to: formData.assigned_to || null,
    })

    if (!error) {
      setFormData({
        title: '',
        description: '',
        priority: 'p2',
        status: 'todo',
        due_date: '',
        assigned_to: '',
      })
      setCreateOpen(false)
      router.refresh()
    }

    setLoading(false)
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTask) return

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('project_tasks')
      .update({
        title: formData.title,
        description: formData.description || null,
        priority: formData.priority as 'p1' | 'p2' | 'p3',
        status: formData.status as 'todo' | 'in_progress' | 'done',
        due_date: formData.due_date || null,
        assigned_to: formData.assigned_to || null,
      })
      .eq('id', editingTask.id)

    if (!error) {
      setEditOpen(false)
      setEditingTask(null)
      router.refresh()
    }

    setLoading(false)
  }

  const handleToggle = async (task: ProjectTask) => {
    const supabase = createClient()
    const newStatus = task.status === 'done' ? 'todo' : 'done'
    const completed_at = newStatus === 'done' ? new Date().toISOString() : null

    await supabase
      .from('project_tasks')
      .update({ status: newStatus, completed_at })
      .eq('id', task.id)

    router.refresh()
  }

  const handleDelete = async (taskId: string) => {
    const supabase = createClient()
    await supabase.from('project_tasks').delete().eq('id', taskId)
    router.refresh()
  }

  const openEdit = (task: ProjectTask) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      due_date: task.due_date || '',
      assigned_to: task.assigned_to || '',
    })
    setEditOpen(true)
  }

  const filteredTasks = filter === 'my'
    ? tasks.filter(t => t.assigned_to === currentUserId)
    : tasks

  const doneCount = filteredTasks.filter((t) => t.status === 'done').length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Tâches du projet ({doneCount}/{filteredTasks.length} terminées)
          </h3>
          <p className="text-sm text-text-secondary">
            Créez et gérez les tâches de ce projet
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                {filter === 'my' ? 'Mes tâches' : 'Toutes'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter('all')}>
                Toutes les tâches
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('my')}>
                Mes tâches
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
                      Statut
                    </label>
                    <Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="todo">À faire</option>
                      <option value="in_progress">En cours</option>
                      <option value="done">Terminé</option>
                    </Select>
                  </div>
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

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Assigner à
                  </label>
                  <Select
                    value={formData.assigned_to}
                    onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                  >
                    <option value="">Non assignée</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.full_name || member.email}
                      </option>
                    ))}
                  </Select>
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
      </div>

      {filteredTasks.length > 0 ? (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={`hover:border-border-light transition-colors ${
                task.status === 'done' ? 'opacity-60' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={task.status === 'done'}
                    onCheckedChange={() => handleToggle(task)}
                    className="mt-1"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3
                        className={`font-medium text-text-primary ${
                          task.status === 'done' ? 'line-through' : ''
                        }`}
                      >
                        {task.title}
                      </h3>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant={priorityColors[task.priority as keyof typeof priorityColors] as any}>
                          {task.priority.toUpperCase()}
                        </Badge>
                        {task.status !== 'todo' && (
                          <Badge variant={statusColors[task.status as keyof typeof statusColors] as any}>
                            {statusLabels[task.status as keyof typeof statusLabels]}
                          </Badge>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(task)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(task.id)}
                              className="text-danger focus:text-danger"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-text-tertiary">
                      {task.due_date && (
                        <span>
                          📅 {new Date(task.due_date).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                      {task.assigned_to && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {task.assigned_user?.full_name || task.assigned_user?.email || 'Assigné'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-text-secondary">
            {filter === 'my' ? 'Aucune tâche assignée à vous' : 'Aucune tâche pour ce projet. Créez-en une !'}
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
                  Statut
                </label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="todo">À faire</option>
                  <option value="in_progress">En cours</option>
                  <option value="done">Terminé</option>
                </Select>
              </div>
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

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Assigner à
              </label>
              <Select
                value={formData.assigned_to}
                onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
              >
                <option value="">Non assignée</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.full_name || member.email}
                  </option>
                ))}
              </Select>
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

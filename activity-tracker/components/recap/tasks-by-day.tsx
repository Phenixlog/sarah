import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock } from 'lucide-react'
import { groupTasksByDay, formatDayName } from '@/lib/utils/week-helpers'
import type { Todo, Project } from '@/types/database'

interface TasksByDayProps {
    tasks: (Todo & { projects?: Project | null })[]
}

export function TasksByDay({ tasks }: TasksByDayProps) {
    if (tasks.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-text-tertiary" />
                        </div>
                        <p className="text-text-secondary text-lg">Aucune tâche complétée cette semaine</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const tasksByDay = groupTasksByDay(tasks)
    const priorityConfig = {
        p1: { variant: 'danger' as const, icon: '🔥', label: 'P1' },
        p2: { variant: 'warning' as const, icon: '⚡', label: 'P2' },
        p3: { variant: 'default' as const, icon: '📌', label: 'P3' },
    }

    return (
        <div className="space-y-6">
            {Object.entries(tasksByDay).map(([day, dayTasks]) => (
                <div key={day}>
                    <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        {formatDayName(day)}
                        <span className="text-sm text-text-tertiary font-normal">
                            ({dayTasks.length} tâche{dayTasks.length > 1 ? 's' : ''})
                        </span>
                    </h3>
                    <div className="space-y-2">
                        {dayTasks.map((task) => (
                            <Card key={task.id} className="hover:border-border-light transition-colors">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-text-primary mb-1">{task.title}</h4>
                                            {task.description && (
                                                <p className="text-sm text-text-secondary line-clamp-1 mb-2">
                                                    {task.description}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 text-xs text-text-tertiary">
                                                <Clock className="w-3 h-3" />
                                                {new Date(task.completed_at!).toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                                {task.projects && (
                                                    <>
                                                        <span>•</span>
                                                        <Badge variant="glass" className="text-xs">
                                                            {task.projects.name}
                                                        </Badge>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <Badge
                                            variant={priorityConfig[task.priority as keyof typeof priorityConfig].variant}
                                            icon={priorityConfig[task.priority as keyof typeof priorityConfig].icon}
                                        >
                                            {priorityConfig[task.priority as keyof typeof priorityConfig].label}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

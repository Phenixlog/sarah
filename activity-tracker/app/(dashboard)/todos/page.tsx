import { createClient } from '@/lib/supabase/server'
import { TodoList } from '@/components/todos/todo-list'
import { CreateTodoDialog } from '@/components/todos/create-todo-dialog'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function TodosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get today's date
  const today = new Date().toISOString().split('T')[0]

  // Get todos for today
  const { data: todayTodos } = await supabase
    .from('todos')
    .select('*, projects(id, name)')
    .eq('user_id', user!.id)
    .eq('due_date', today)
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false })

  // Get tomorrow's todos
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowDate = tomorrow.toISOString().split('T')[0]

  const { data: tomorrowTodos } = await supabase
    .from('todos')
    .select('*, projects(id, name)')
    .eq('user_id', user!.id)
    .eq('due_date', tomorrowDate)
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false })

  // Get backlog (no due date)
  const { data: backlogTodos } = await supabase
    .from('todos')
    .select('*, projects(id, name)')
    .eq('user_id', user!.id)
    .is('due_date', null)
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false })

  // Get overdue todos
  const { data: overdueTodos } = await supabase
    .from('todos')
    .select('*, projects(id, name)')
    .eq('user_id', user!.id)
    .lt('due_date', today)
    .neq('status', 'done')
    .order('due_date', { ascending: true })

  // Get all projects for the create dialog
  const { data: projects } = await supabase
    .from('projects')
    .select('id, name')
    .or(`owner_id.eq.${user!.id},team_members.cs.{${user!.id}}`)
    .order('name', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">To-Do</h1>
          <p className="text-text-secondary">Gérez vos tâches quotidiennes</p>
        </div>
        <CreateTodoDialog projects={projects || []} />
      </div>

      {overdueTodos && overdueTodos.length > 0 && (
        <Card className="border-danger/20 bg-danger/5">
          <div className="p-4">
            <h3 className="font-semibold text-danger mb-3">
              Tâches en retard ({overdueTodos.length})
            </h3>
            <TodoList todos={overdueTodos} projects={projects || []} />
          </div>
        </Card>
      )}

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-surface-elevated">
          <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
          <TabsTrigger value="tomorrow">Demain</TabsTrigger>
          <TabsTrigger value="backlog">Backlog</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-6">
          <TodoList todos={todayTodos || []} projects={projects || []} emptyMessage="Aucune tâche pour aujourd'hui" />
        </TabsContent>

        <TabsContent value="tomorrow" className="mt-6">
          <TodoList todos={tomorrowTodos || []} projects={projects || []} emptyMessage="Aucune tâche pour demain" />
        </TabsContent>

        <TabsContent value="backlog" className="mt-6">
          <TodoList todos={backlogTodos || []} projects={projects || []} emptyMessage="Aucune tâche dans le backlog" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

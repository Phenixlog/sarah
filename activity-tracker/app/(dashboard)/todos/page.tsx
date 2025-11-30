import { createClient } from '@/lib/supabase/server'
import { TodoList } from '@/components/todos/todo-list'
import { CreateTodoDialog } from '@/components/todos/create-todo-dialog'
import { DateNavigator } from '@/components/todos/date-navigator'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Target } from 'lucide-react'

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const today = new Date().toISOString().split('T')[0]
  const selectedDate = params.date || today
  const isToday = selectedDate === today

  // Optimize queries by running in parallel
  const startOfDay = new Date(selectedDate + 'T00:00:00').toISOString()
  const endOfDay = new Date(selectedDate + 'T23:59:59').toISOString()

  let focusTodos = []
  let completedOnDate = []
  let error = null

  try {
    const [
      { data: focusData, error: focusError },
      { data: completedData, error: completedError }
    ] = await Promise.all([
      supabase
        .from('todos')
        .select('*')
        .eq('user_id', user!.id)
        .lte('due_date', selectedDate)
        .neq('status', 'done')
        .order('priority', { ascending: true })
        .order('due_date', { ascending: true }),

      supabase
        .from('todos')
        .select('*')
        .eq('user_id', user!.id)
        .eq('status', 'done')
        .gte('completed_at', startOfDay)
        .lte('completed_at', endOfDay)
        .order('completed_at', { ascending: false })
    ])

    if (focusError) {
      console.error('Focus Error:', focusError)
      throw focusError
    }
    if (completedError) {
      console.error('Completed Error:', completedError)
      throw completedError
    }

    focusTodos = focusData || []
    completedOnDate = completedData || []

  } catch (e) {
    console.error('CRITICAL ERROR loading todos:', e)
    error = e
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-xl font-bold mb-2">Erreur de chargement</h2>
        <p>Une erreur est survenue lors du chargement de vos tâches.</p>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-left text-xs overflow-auto max-w-lg mx-auto">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    )
  }

  const totalFocus = focusTodos.length
  const completedCount = completedOnDate.length

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            {isToday ? 'Focus du Jour' : 'Historique'}
          </h1>
          <p className="text-text-secondary mt-2 text-base">
            {totalFocus > 0
              ? `${totalFocus} tâche${totalFocus > 1 ? 's' : ''} ${isToday ? 'à traiter' : 'ce jour-là'}`
              : isToday ? "Tout est à jour" : "Aucune tâche ce jour-là"}
          </p>
        </div>
        {isToday && <CreateTodoDialog />}
      </div>

      {/* Date Navigator */}
      <DateNavigator currentDate={selectedDate} />

      {/* Main Focus List */}
      <div className="space-y-4">
        {focusTodos.length > 0 ? (
          <TodoList
            todos={focusTodos}
            emptyMessage="Aucune tâche"
          />
        ) : (
          <Card className="border-dashed border-primary/20 bg-primary/5">
            <CardContent className="p-12 text-center flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  {isToday ? 'Vous êtes à jour !' : 'Aucune tâche'}
                </h3>
                <p className="text-text-secondary">
                  {isToday
                    ? "Aucune tâche en retard ou prévue pour aujourd'hui."
                    : "Aucune tâche pour cette date."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Completed Section */}
      {completedOnDate.length > 0 && (
        <div className="pt-8 border-t border-border/50">
          <h3 className="text-lg font-semibold text-text-secondary mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Terminé {isToday ? "aujourd'hui" : 'ce jour-là'} ({completedCount})
          </h3>
          <div className="opacity-75 hover:opacity-100 transition-opacity">
            <TodoList todos={completedOnDate} />
          </div>
        </div>
      )}
    </div>
  )
}

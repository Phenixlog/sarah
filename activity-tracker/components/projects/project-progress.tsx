'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Project } from '@/types/database'

export function ProjectProgress({ project, isOwner }: { project: Project; isOwner: boolean }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [progress, setProgress] = useState(project.progress)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('projects')
      .update({ progress })
      .eq('id', project.id)

    if (!error) {
      setEditing(false)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Progression du projet</CardTitle>
          {isOwner && !editing && (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              Modifier
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {editing ? (
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-text-secondary">%</span>
              <Button size="sm" onClick={handleUpdate} disabled={loading}>
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditing(false)
                  setProgress(project.progress)
                }}
              >
                Annuler
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-text-primary">{project.progress}%</span>
            </div>
          )}

          <div className="w-full bg-surface h-4 rounded-full overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-500"
              style={{ width: `${editing ? progress : project.progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

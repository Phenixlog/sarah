'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, Trash2 } from 'lucide-react'
import type { ProjectDocument } from '@/types/database'

export function ProjectDocuments({
  projectId,
  documents,
}: {
  projectId: string
  documents: (ProjectDocument & { profiles?: any })[]
}) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Documents ({documents.length})
          </h3>
          <p className="text-sm text-text-secondary">
            Fichiers et ressources du projet
          </p>
        </div>

        <Button variant="outline" className="gap-2" disabled>
          <FileText className="w-4 h-4" />
          Ajouter un document
        </Button>
      </div>

      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-surface">
                    <FileText className="w-5 h-5 text-text-secondary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-text-primary truncate mb-1">
                      {doc.name}
                    </h4>
                    <p className="text-xs text-text-tertiary mb-2">
                      {formatFileSize(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-xs text-text-secondary">
                      Ajouté par {doc.profiles?.full_name || 'Utilisateur'}
                    </p>
                  </div>

                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-text-secondary">
            Aucun document pour ce projet
          </CardContent>
        </Card>
      )}

      <Card className="border-warning/20 bg-warning/5">
        <CardContent className="p-4">
          <p className="text-sm text-text-secondary">
            📌 La fonctionnalité d&apos;upload de fichiers sera disponible prochainement.
            Pour le moment, vous pouvez utiliser des liens externes dans les notes.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

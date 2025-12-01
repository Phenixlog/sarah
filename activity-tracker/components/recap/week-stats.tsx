import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Flame, Zap, Pin } from 'lucide-react'

interface WeekStatsProps {
    stats: {
        totalCompleted: number
        p1Count: number
        p2Count: number
        p3Count: number
    }
}

export function WeekStats({ stats }: WeekStatsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-text-primary">{stats.totalCompleted}</p>
                            <p className="text-sm text-text-secondary">Tâches terminées</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                            <Flame className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-text-primary">{stats.p1Count}</p>
                            <p className="text-sm text-text-secondary">P1 complétées</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-text-primary">{stats.p2Count}</p>
                            <p className="text-sm text-text-secondary">P2 complétées</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Pin className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-text-primary">{stats.p3Count}</p>
                            <p className="text-sm text-text-secondary">P3 complétées</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

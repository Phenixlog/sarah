'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { getPreviousWeek, getNextWeek, formatWeekRange } from '@/lib/utils/week-helpers'

interface WeekNavigatorProps {
    currentWeek: string
}

export function WeekNavigator({ currentWeek }: WeekNavigatorProps) {
    const router = useRouter()

    const goToPreviousWeek = () => {
        const prevWeek = getPreviousWeek(currentWeek)
        router.push(`/recap?week=${prevWeek}`)
    }

    const goToNextWeek = () => {
        const nextWeek = getNextWeek(currentWeek)
        router.push(`/recap?week=${nextWeek}`)
    }

    const goToCurrentWeek = () => {
        router.push('/recap')
    }

    return (
        <div className="flex items-center justify-between gap-4 mb-6">
            <Button
                variant="ghost"
                size="icon"
                onClick={goToPreviousWeek}
                className="h-10 w-10"
            >
                <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex flex-col items-center gap-1">
                <h2 className="text-2xl font-bold text-text-primary">
                    Semaine du {formatWeekRange(currentWeek)}
                </h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToCurrentWeek}
                    className="text-xs text-text-tertiary hover:text-primary"
                >
                    <Calendar className="w-3 h-3 mr-1" />
                    Semaine actuelle
                </Button>
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={goToNextWeek}
                className="h-10 w-10"
            >
                <ChevronRight className="w-5 h-5" />
            </Button>
        </div>
    )
}

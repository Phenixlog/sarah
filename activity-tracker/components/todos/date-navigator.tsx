'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface DateNavigatorProps {
    currentDate: string
}

export function DateNavigator({ currentDate }: DateNavigatorProps) {
    const router = useRouter()
    const today = new Date().toISOString().split('T')[0]
    const isToday = currentDate === today

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T12:00:00')
        return new Intl.DateTimeFormat('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date)
    }

    const navigateDate = (offset: number) => {
        const date = new Date(currentDate + 'T12:00:00')
        date.setDate(date.getDate() + offset)
        const newDate = date.toISOString().split('T')[0]
        router.push(`/todos?date=${newDate}`)
    }

    const goToToday = () => {
        router.push('/todos')
    }

    const isFuture = currentDate > today

    return (
        <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border/50 bg-surface-elevated/50">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateDate(-1)}
                className="h-8 w-8"
            >
                <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-text-secondary" />
                <span className="text-sm font-medium text-text-primary capitalize">
                    {formatDate(currentDate)}
                </span>
                {!isToday && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={goToToday}
                        className="h-7 text-xs"
                    >
                        Aujourd'hui
                    </Button>
                )}
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateDate(1)}
                disabled={isFuture}
                className="h-8 w-8"
            >
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    )
}

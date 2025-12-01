export function getDaysOld(createdAt: string): number {
    const created = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - created.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
}

export function getAgeConfig(days: number) {
    if (days <= 3) {
        return {
            variant: 'default' as const,
            label: 'Nouveau',
            color: 'text-text-tertiary'
        }
    } else if (days <= 7) {
        return {
            variant: 'default' as const,
            label: `${days}j`,
            color: 'text-blue-400'
        }
    } else if (days <= 14) {
        return {
            variant: 'warning' as const,
            label: `${days}j`,
            color: 'text-orange-400'
        }
    } else {
        return {
            variant: 'danger' as const,
            label: `${days}j`,
            color: 'text-red-400'
        }
    }
}

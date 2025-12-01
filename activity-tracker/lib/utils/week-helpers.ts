export function getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

export function getCurrentWeek(): string {
    const now = new Date()
    const weekNumber = getWeekNumber(now)
    return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`
}

export function getDateOfISOWeek(week: number, year: number): Date {
    const simple = new Date(year, 0, 1 + (week - 1) * 7)
    const dow = simple.getDay()
    const ISOweekStart = simple
    if (dow <= 4) {
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
    } else {
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
    }
    return ISOweekStart
}

export function getWeekDates(weekString: string) {
    const [year, week] = weekString.split('-W')
    const startDate = getDateOfISOWeek(parseInt(week), parseInt(year))
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 6)
    endDate.setHours(23, 59, 59, 999)

    return {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
    }
}

export function getPreviousWeek(weekString: string): string {
    const [year, week] = weekString.split('-W')
    const weekNum = parseInt(week)

    if (weekNum === 1) {
        const prevYear = parseInt(year) - 1
        const lastWeek = getWeekNumber(new Date(prevYear, 11, 28))
        return `${prevYear}-W${lastWeek.toString().padStart(2, '0')}`
    }

    return `${year}-W${(weekNum - 1).toString().padStart(2, '0')}`
}

export function getNextWeek(weekString: string): string {
    const [year, week] = weekString.split('-W')
    const weekNum = parseInt(week)
    const lastWeekOfYear = getWeekNumber(new Date(parseInt(year), 11, 28))

    if (weekNum >= lastWeekOfYear) {
        return `${parseInt(year) + 1}-W01`
    }

    return `${year}-W${(weekNum + 1).toString().padStart(2, '0')}`
}

export function formatWeekRange(weekString: string): string {
    const { startDate, endDate } = getWeekDates(weekString)
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Use manual formatting to ensure consistency between server and client
    const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

    const startDay = start.getDate()
    const startMonth = months[start.getMonth()]

    const endDay = end.getDate()
    const endMonth = months[end.getMonth()]
    const endYear = end.getFullYear()

    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${endYear}`
}

export function groupTasksByDay(tasks: any[]) {
    const grouped: Record<string, any[]> = {}

    tasks.forEach(task => {
        const date = new Date(task.completed_at)
        const dayKey = date.toISOString().split('T')[0]

        if (!grouped[dayKey]) {
            grouped[dayKey] = []
        }
        grouped[dayKey].push(task)
    })

    return grouped
}

export function formatDayName(dateString: string): string {
    const date = new Date(dateString)

    // Use manual formatting to ensure consistency between server and client
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

    const dayName = days[date.getDay()]
    const dayNum = date.getDate()
    const monthName = months[date.getMonth()]

    // Capitalize first letter
    return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dayNum} ${monthName}`
}

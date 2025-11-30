import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function TodosLoading() {
    return (
        <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-5 w-48" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Date Navigator Skeleton */}
            <Skeleton className="h-16 w-full" />

            {/* Todo List Skeleton */}
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                ))}
            </div>
        </div>
    )
}

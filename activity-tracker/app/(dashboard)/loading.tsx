import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-12 w-48" />
                <Skeleton className="h-5 w-64" />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                ))}
            </div>

            {/* Content Sections Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-20 w-full" />
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <Skeleton key={i} className="h-24 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

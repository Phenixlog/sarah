import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function ProjectDetailLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-5 w-96" />
            </div>

            {/* Progress */}
            <Card>
                <CardContent className="p-6">
                    <Skeleton className="h-4 w-full" />
                </CardContent>
            </Card>

            {/* Tabs */}
            <div className="space-y-4">
                <Skeleton className="h-10 w-full max-w-2xl" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-5 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Skeleton className="h-5 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}


import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
    return (
        <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto p-6 animate-pulse">
            {/* Top Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-2xl" />
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-[400px] rounded-3xl" />
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-40 rounded-2xl" />
                        <Skeleton className="h-40 rounded-2xl" />
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <Skeleton className="h-[300px] rounded-3xl" />
                    <Skeleton className="h-[200px] rounded-3xl" />
                </div>
            </div>
        </div>
    );
}

export function ProfileSkeleton() {
    return (
        <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto p-6">
            <div className="flex items-center gap-6">
                <Skeleton className="w-32 h-32 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
            <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
    );
}

import { cn } from "@/lib/utils"

interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number
}

export const LoadingSkeleton = ({ rows = 25, className, ...props }: LoadingSkeletonProps) => {
  return (
    <div className={cn("", className)} {...props}>
      {/* Table Header */}
      <div className="border-b border-border">
        <div className="flex items-center">
          <div className="w-16 text-center font-semibold text-foreground h-12 px-4 flex items-center justify-center">RANK</div>
          <div className="flex-1 font-semibold text-foreground h-12 px-4 flex items-center">PET</div>
          <div className="text-right font-semibold text-foreground h-12 px-4 flex items-center justify-end">
            <div>Tokens</div>
          </div>
          <div className="text-right font-semibold text-foreground w-24 h-12 px-4 flex items-center justify-end">
            <div className="flex items-center justify-end gap-1">
              Cost
            </div>
          </div>
          <div className="text-right font-semibold text-foreground w-32 h-12 px-4 flex items-center justify-end">
            <div className="flex items-center justify-end gap-1">
              Status
            </div>
          </div>
        </div>
      </div>
      
      {/* Table Body */}
      <div className="space-y-0">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center px-4 py-4 border-b border-border/50 animate-pulse">
            <div className="w-16 text-center">
              <div className="w-6 h-6 bg-muted rounded mx-auto" />
            </div>
            <div className="flex-1 flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded-full" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-20" />
                <div className="h-3 bg-muted rounded w-16" />
              </div>
            </div>
            <div className="w-32 text-right space-y-2">
              <div className="h-4 bg-muted rounded w-16 ml-auto" />
              <div className="h-3 bg-muted rounded w-20 ml-auto" />
            </div>
            <div className="w-24 text-right">
              <div className="h-4 bg-muted rounded w-16 ml-auto" />
            </div>
            <div className="w-32 text-right space-y-2">
              <div className="h-4 bg-muted rounded w-16 ml-auto" />
              <div className="h-3 bg-muted rounded w-20 ml-auto" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border">
        <div className="h-4 bg-muted rounded w-32" />
        <div className="flex items-center gap-2">
          <div className="h-8 bg-muted rounded w-20" />
          <div className="h-4 bg-muted rounded w-20" />
          <div className="h-8 bg-muted rounded w-16" />
        </div>
      </div>
    </div>
  )
}

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export const ErrorState = ({
  title = "Something went wrong",
  message = "Failed to load data. Please try again.",
  onRetry
}: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="text-6xl">😿</div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

interface EmptyStateProps {
  title?: string
  message?: string
  icon?: string
}

export const EmptyState = ({
  title = "No data found",
  message = "There are no pets to display for this time period.",
  icon = "📭"
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="text-6xl">{icon}</div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground max-w-sm">{message}</p>
      </div>
    </div>
  )
}
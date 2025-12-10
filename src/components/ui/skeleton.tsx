import React from "react";

// Base skeleton component
function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      {...props}
    />
  );
}

// Skeleton loaders for different components
export function SkeletonCard() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full mt-4" />
    </div>
  );
}

export function SkeletonCardGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? "w-3/4" : "w-full"}`}
        />
      ))}
    </div>
  );
}

export function SkeletonImage({
  width = "w-full",
  height = "h-48",
}: {
  width?: string;
  height?: string;
}) {
  return <Skeleton className={`${width} ${height} rounded-lg`} />;
}

export function SkeletonBanner({
  height = "h-64",
}: {
  height?: string;
}) {
  return (
    <div className="space-y-4">
      <Skeleton className={`w-full ${height} rounded-lg`} />
      <div className="space-y-2 px-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-10 w-20 rounded" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTestimonial() {
  return (
    <div className="space-y-4 p-6 border rounded-lg">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <SkeletonText lines={2} />
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-4 rounded-full" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonForm({ fields = 3 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
      <Skeleton className="h-10 w-full rounded-md mt-6" />
    </div>
  );
}

export function SkeletonPageContent() {
  return (
    <div className="space-y-8">
      <SkeletonBanner />
      <div className="px-4">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <SkeletonCardGrid count={3} />
      </div>
    </div>
  );
}

export function SkeletonTableRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-20" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonHeroCarousel() {
  return (
    <div className="space-y-4">
      <Skeleton className="w-full h-96 rounded-lg" />
      <div className="flex justify-center gap-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-2 w-2 rounded-full" />
        ))}
      </div>
    </div>
  );
}

export { Skeleton };

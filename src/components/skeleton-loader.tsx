
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton = ({ className, count = 1 }: SkeletonProps) => {
  const items = Array.from({ length: count }).map((_, i) => (
    <div 
      key={i} 
      className={cn(
        "h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse-slow",
        className
      )} 
    />
  ));
  
  return <>{items}</>;
};

export const CategorySkeleton = () => {
  return (
    <div className="space-y-3 mb-6">
      <Skeleton className="h-8 w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton className="h-24 w-full rounded-md" />
        <Skeleton className="h-24 w-full rounded-md" />
        <Skeleton className="h-24 w-full rounded-md" />
        <Skeleton className="h-24 w-full rounded-md" />
      </div>
    </div>
  );
};

export const MenuItemSkeleton = () => {
  return (
    <div className="menu-item-card p-4">
      <Skeleton className="h-40 w-full rounded-md mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-8 w-full rounded-md" />
    </div>
  );
};

export const TablesSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <Skeleton className="h-12 w-12 mx-auto rounded-full mb-3" />
          <Skeleton className="h-5 w-1/2 mx-auto mb-2" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>
      ))}
    </div>
  );
};

export const OrderSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between mb-3">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
      </div>
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="space-y-2 mb-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/3" />
      </div>
    </div>
  );
};

import { motion } from 'framer-motion';

export const Skeleton = ({ className = '', variant = 'rect' }) => {
  const base = 'animate-pulse rounded bg-white/10';

  if (variant === 'circle') {
    return <div className={`${base} rounded-full ${className}`} />;
  }

  if (variant === 'text') {
    return <div className={`${base} h-4 ${className}`} />;
  }

  return <div className={`${base} ${className}`} />;
};

export const CardSkeleton = () => (
  <div className="rounded-xl border border-white/10 bg-white/5 p-6">
    <Skeleton className="mb-4 h-5 w-32" />
    <Skeleton className="mb-2 h-4 w-full" variant="text" />
    <Skeleton className="mb-2 h-4 w-3/4" variant="text" />
    <Skeleton className="h-4 w-1/2" variant="text" />
  </div>
);

export const SphereSkeleton = ({ size = 'large' }) => {
  const dim = size === 'large' ? 'h-80 w-80' : size === 'medium' ? 'h-48 w-48' : 'h-24 w-24';
  return (
    <div className={`${dim} flex items-center justify-center`}>
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`rounded-full bg-gradient-to-br from-purple-500/20 to-purple-700/20 ${dim}`}
      />
    </div>
  );
};

export const ListSkeleton = ({ count = 3 }) => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
        <Skeleton className="h-10 w-10" variant="circle" />
        <div className="flex-1">
          <Skeleton className="mb-1 h-4 w-24" variant="text" />
          <Skeleton className="h-3 w-40" variant="text" />
        </div>
      </div>
    ))}
  </div>
);

export const DashboardSkeleton = () => (
  <div className="flex flex-col gap-6">
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="mb-2 h-7 w-48" />
        <Skeleton className="h-4 w-64" variant="text" />
      </div>
      <Skeleton className="h-14 w-14" variant="circle" />
    </div>
    <Skeleton className="h-12 w-48 rounded-xl" />
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <Skeleton className="mb-3 h-5 w-32" />
      <SphereSkeleton size="large" />
    </div>
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <Skeleton className="mb-4 h-5 w-40" />
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg bg-white/5 p-4">
            <Skeleton className="mb-2 h-3 w-16" variant="text" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="flex flex-col items-center gap-6">
    <div className="text-center">
      <Skeleton className="mx-auto mb-2 h-16 w-16" variant="circle" />
      <Skeleton className="mx-auto mb-1 h-6 w-32" />
      <Skeleton className="mx-auto h-4 w-20" variant="text" />
    </div>
    <SphereSkeleton size="large" />
    <div className="w-full max-w-md">
      <Skeleton className="mb-3 h-5 w-32" />
      <ListSkeleton count={4} />
    </div>
  </div>
);

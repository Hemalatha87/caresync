import React from 'react';

export function DoctorSkeleton() {
  return (
    <div className="bg-white dark:bg-[#111B33] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 animate-pulse">
      <div className="w-full aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3 mb-2" />
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4 mb-2" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2 mb-4" />
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4" />
        <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3" />
      </div>
    </div>
  );
}

export function DoctorGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <DoctorSkeleton key={i} />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white dark:bg-[#111B33] rounded-3xl border border-slate-200 dark:border-slate-800 p-6" />
        ))}
      </div>
      <div className="h-80 bg-white dark:bg-[#111B33] rounded-3xl border border-slate-200 dark:border-slate-800 p-6" />
    </div>
  );
}

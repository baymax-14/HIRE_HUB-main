import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="p-6 rounded-2xl bg-white border border-[#f1f5f9] shadow-xs animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-slate-200 rounded-xl"></div>
          <div className="space-y-1.5">
            <div className="h-3.5 bg-slate-200 rounded-md w-24"></div>
            <div className="h-2.5 bg-slate-200 rounded-md w-16"></div>
          </div>
        </div>
        <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
      </div>
      <div className="space-y-2 py-1">
        <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
        <div className="h-3 bg-slate-200 rounded-md w-full"></div>
        <div className="h-3 bg-slate-200 rounded-md w-4/5"></div>
      </div>
      <div className="flex items-center gap-2 pt-3 border-t border-[#f1f5f9]">
        <div className="h-5 bg-slate-200 rounded-full w-20"></div>
        <div className="h-5 bg-slate-200 rounded-full w-20"></div>
        <div className="h-5 bg-slate-200 rounded-full w-16 ml-auto"></div>
      </div>
    </div>
  );
}

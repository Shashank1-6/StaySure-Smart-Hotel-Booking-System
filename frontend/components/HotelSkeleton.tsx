import React from 'react';

export const HotelSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
      <div className="h-64 bg-slate-200"></div>
      <div className="p-6">
        <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
        <div className="flex gap-2 mb-6">
          <div className="h-6 w-16 bg-slate-200 rounded-md"></div>
          <div className="h-6 w-16 bg-slate-200 rounded-md"></div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
          <div className="h-8 w-24 bg-slate-200 rounded"></div>
          <div className="h-10 w-28 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};
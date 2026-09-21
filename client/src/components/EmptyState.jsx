import React from 'react';
import { SearchX, CalendarX, AlertCircle } from 'lucide-react';

export default function EmptyState({ title = 'No results found', message = 'Try adjusting your filters or search keywords.', icon = 'search', action }) {
  const icons = {
    search: <SearchX className="w-12 h-12 text-slate-300" />,
    calendar: <CalendarX className="w-12 h-12 text-slate-300" />,
    alert: <AlertCircle className="w-12 h-12 text-slate-300" />,
  };

  return (
    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm flex flex-col items-center justify-center my-6">
      <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
        {icons[icon] || icons.search}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{message}</p>
      {action}
    </div>
  );
}

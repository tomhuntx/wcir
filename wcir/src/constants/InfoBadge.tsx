import type { ReactNode } from 'react';

export const InfoBadge = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center rounded-full border border-emerald-700 bg-emerald-900 px-3 py-1 text-xs font-medium text-emerald-200">
    {children}
  </span>
);

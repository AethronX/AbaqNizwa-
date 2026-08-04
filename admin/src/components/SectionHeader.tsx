import React from 'react';

export const SectionHeader: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ title, description, action }) => (
  <div className="flex items-end justify-between gap-3 flex-wrap">
    <div>
      <h2 className="text-lg font-extrabold text-gray-900 dark:text-gray-100">{title}</h2>
      {description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{description}</p>}
    </div>
    {action}
  </div>
);

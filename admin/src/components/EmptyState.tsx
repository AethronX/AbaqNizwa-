import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState: React.FC<{
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ icon: Icon = Inbox, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-10 px-4 gap-2">
    <div className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-1">
      <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
    </div>
    <p className="text-sm font-bold text-gray-600 dark:text-gray-300">{title}</p>
    {description && <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">{description}</p>}
    {action && <div className="pt-2">{action}</div>}
  </div>
);

import { Search } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-4 max-w-md px-4">
        <div className="flex justify-center">
          {icon || (
            <div className="rounded-full bg-gray-100 p-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
        {action && <div className="pt-2">{action}</div>}
      </div>
    </div>
  );
}

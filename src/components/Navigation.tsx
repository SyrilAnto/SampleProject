import { ClipboardList, ListChecks, BarChart3, LogOut } from 'lucide-react';
import type { User } from '../App';

type NavigationProps = {
  currentPage: 'assign' | 'status' | 'reports';
  onNavigate: (page: 'assign' | 'status' | 'reports') => void;
  currentUser: User;
  onLogout: () => void;
};

export function Navigation({ currentPage, onNavigate, currentUser, onLogout }: NavigationProps) {
  const navItems = [
    { id: 'assign' as const, label: 'Assign Work', icon: ClipboardList },
    { id: 'status' as const, label: 'Update Status', icon: ListChecks },
    { id: 'reports' as const, label: 'Reports', icon: BarChart3 },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h2 className="text-indigo-600">Work Manager</h2>
            
            <div className="flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      currentPage === item.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-gray-900">{currentUser.username}</p>
              <p className="text-gray-500 capitalize">{currentUser.role}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

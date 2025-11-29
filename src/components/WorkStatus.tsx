import { useState } from 'react';
import { CheckCircle2, Clock, PlayCircle, AlertCircle } from 'lucide-react';
import type { User, WorkItem } from '../App';

type WorkStatusProps = {
  currentUser: User;
  workItems: WorkItem[];
  onUpdateStatus: (id: string, status: WorkItem['status']) => void;
};

export function WorkStatus({ currentUser, workItems, onUpdateStatus }: WorkStatusProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  const filteredItems = workItems.filter((item) => {
    // Admin and user1 can view all items
    if (currentUser.role === 'admin' || currentUser.role === 'user1') {
      if (filter !== 'all' && item.status !== filter) {
        return false;
      }
      return true;
    }
    
    // user2 and user3 can only view items assigned to them
    if ((currentUser.role === 'user2' || currentUser.role === 'user3') && item.assignedTo !== currentUser.username) {
      return false;
    }
    
    // Filter by status
    if (filter !== 'all' && item.status !== filter) {
      return false;
    }
    return true;
  });

  const getStatusIcon = (status: WorkItem['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'in-progress':
        return <PlayCircle className="w-5 h-5 text-blue-600" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
  };

  const getStatusColor = (status: WorkItem['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPriorityColor = (priority: WorkItem['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'high':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Work Status Updates</h1>
        <p className="text-gray-600">View and update the status of assigned tasks</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-gray-700">Filter:</span>
          <div className="flex space-x-2">
            {(['all', 'pending', 'in-progress', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'All' : f.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No work items found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-gray-900">{item.title}</h3>
                    <span className={`px-3 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{item.description}</p>
                  <div className="flex items-center space-x-4 text-gray-500">
                    <span>Assigned to: {item.assignedTo}</span>
                    <span>•</span>
                    <span>By: {item.assignedBy}</span>
                    <span>•</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                  <span className="capitalize">{item.status.replace('-', ' ')}</span>
                </div>

                {currentUser.role === 'user1' && item.assignedTo === currentUser.username && (
                  <div className="flex space-x-2">
                    {item.status !== 'in-progress' && (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'in-progress')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start Work
                      </button>
                    )}
                    {item.status === 'in-progress' && (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'completed')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                )}

                {(currentUser.role === 'user2' || currentUser.role === 'user3') && item.assignedTo === currentUser.username && (
                  <div className="flex space-x-2">
                    {item.status !== 'in-progress' && (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'in-progress')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start Work
                      </button>
                    )}
                    {item.status === 'in-progress' && (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'completed')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                )}

                {currentUser.role === 'user1' && item.assignedTo !== currentUser.username && (
                  <select
                    value={item.status}
                    onChange={(e) => onUpdateStatus(item.id, e.target.value as WorkItem['status'])}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                )}

                {currentUser.role === 'admin' && (
                  <select
                    value={item.status}
                    onChange={(e) => onUpdateStatus(item.id, e.target.value as WorkItem['status'])}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

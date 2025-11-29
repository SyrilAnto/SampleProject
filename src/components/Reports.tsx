import { BarChart3, TrendingUp, Users, CheckCircle } from 'lucide-react';
import type { WorkItem, User } from '../App';

type ReportsProps = {
  workItems: WorkItem[];
  currentUser: User;
};

export function Reports({ workItems, currentUser }: ReportsProps) {
  // Calculate statistics
  const totalTasks = workItems.length;
  const completedTasks = workItems.filter(item => item.status === 'completed').length;
  const inProgressTasks = workItems.filter(item => item.status === 'in-progress').length;
  const pendingTasks = workItems.filter(item => item.status === 'pending').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Group by assignee
  const tasksByAssignee = workItems.reduce((acc, item) => {
    if (!acc[item.assignedTo]) {
      acc[item.assignedTo] = { total: 0, completed: 0, inProgress: 0, pending: 0 };
    }
    acc[item.assignedTo].total++;
    if (item.status === 'completed') acc[item.assignedTo].completed++;
    if (item.status === 'in-progress') acc[item.assignedTo].inProgress++;
    if (item.status === 'pending') acc[item.assignedTo].pending++;
    return acc;
  }, {} as Record<string, { total: number; completed: number; inProgress: number; pending: number }>);

  // Group by priority
  const tasksByPriority = workItems.reduce((acc, item) => {
    acc[item.priority] = (acc[item.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Work Reports & Analytics</h1>
        <p className="text-gray-600">Overview of work assignments and completion rates</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Tasks</span>
            <BarChart3 className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-gray-900">{totalTasks}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Completed</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-gray-900">{completedTasks}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">In Progress</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-gray-900">{inProgressTasks}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Completion Rate</span>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-gray-900">{completionRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-gray-900 mb-4">Task Status Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Pending</span>
                <span className="text-gray-900">{pendingTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-500 h-3 rounded-full transition-all"
                  style={{ width: `${totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">In Progress</span>
                <span className="text-gray-900">{inProgressTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{ width: `${totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Completed</span>
                <span className="text-gray-900">{completedTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-gray-900 mb-4">Priority Distribution</h3>
          <div className="space-y-4">
            {(['high', 'medium', 'low'] as const).map((priority) => {
              const count = tasksByPriority[priority] || 0;
              const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
              const colors = {
                high: 'bg-red-500',
                medium: 'bg-orange-500',
                low: 'bg-gray-500',
              };
              
              return (
                <div key={priority}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 capitalize">{priority}</span>
                    <span className="text-gray-900">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${colors[priority]} h-3 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Employee Performance */}
        {currentUser.role === 'admin' && (
          <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
            <h3 className="text-gray-900 mb-4">Employee Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-700">Employee</th>
                    <th className="text-left py-3 px-4 text-gray-700">Total Tasks</th>
                    <th className="text-left py-3 px-4 text-gray-700">Completed</th>
                    <th className="text-left py-3 px-4 text-gray-700">In Progress</th>
                    <th className="text-left py-3 px-4 text-gray-700">Pending</th>
                    <th className="text-left py-3 px-4 text-gray-700">Completion %</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(tasksByAssignee).map(([assignee, stats]) => {
                    const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
                    
                    return (
                      <tr key={assignee} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900">{assignee}</td>
                        <td className="py-3 px-4 text-gray-700">{stats.total}</td>
                        <td className="py-3 px-4 text-green-600">{stats.completed}</td>
                        <td className="py-3 px-4 text-blue-600">{stats.inProgress}</td>
                        <td className="py-3 px-4 text-yellow-600">{stats.pending}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full transition-all"
                                style={{ width: `${completionPercentage}%` }}
                              />
                            </div>
                            <span className="text-gray-900">{completionPercentage}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

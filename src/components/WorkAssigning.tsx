import { useState } from 'react';
import { Plus, UserPlus } from 'lucide-react';
import type { User, WorkItem } from '../App';

type WorkAssigningProps = {
  currentUser: User;
  onAddWork: (item: Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
};

const employees = ['user1', 'user2', 'John Doe', 'Jane Smith', 'Mike Johnson'];

export function WorkAssigning({ currentUser, onAddWork }: WorkAssigningProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !assignedTo) {
      return;
    }

    onAddWork({
      title,
      description,
      assignedTo,
      assignedBy: currentUser.username,
      status: 'pending',
      priority,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setPriority('medium');

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg">
            <UserPlus className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-gray-900">Assign New Work</h2>
            <p className="text-gray-600">Create and assign tasks to team members</p>
          </div>
        </div>

        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Work assigned successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-gray-700 mb-2">
              Task Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={4}
              placeholder="Enter task description"
              required
            />
          </div>

          <div>
            <label htmlFor="assignedTo" className="block text-gray-700 mb-2">
              Assign To
            </label>
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee} value={employee}>
                  {employee}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Priority</label>
            <div className="flex space-x-4">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <label key={p} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    checked={priority === p}
                    onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700 capitalize">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Assign Work</span>
          </button>
        </form>
      </div>
    </div>
  );
}

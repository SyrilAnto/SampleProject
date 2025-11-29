import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { WorkAssigning } from './components/WorkAssigning';
import { WorkStatus } from './components/WorkStatus';
import { Reports } from './components/Reports';
import { Navigation } from './components/Navigation';

export type WorkItem = {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
};

export type User = {
  username: string;
  role: 'admin' | 'user1' | 'user2' | 'user3' | 'employee';
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'assign' | 'status' | 'reports'>('status');
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const savedWork = localStorage.getItem('workItems');
    if (savedWork) {
      setWorkItems(JSON.parse(savedWork));
    }
  }, []);

  useEffect(() => {
    if (workItems.length > 0) {
      localStorage.setItem('workItems', JSON.stringify(workItems));
    }
  }, [workItems]);

  const handleLogin = (username: string, password: string) => {
    // Mock authentication
    const users = [
      { username: 'admin', password: 'admin123', role: 'admin' as const },
      { username: 'user1', password: 'pass123', role: 'user1' as const },
      { username: 'user2', password: 'pass123', role: 'user2' as const },
      { username: 'user3', password: 'pass123', role: 'user3' as const },
    ];

    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      const currentUser = { username: user.username, role: user.role };
      setCurrentUser(currentUser);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('status');
  };

  const addWorkItem = (item: Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: WorkItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWorkItems([...workItems, newItem]);
  };

  const updateWorkStatus = (id: string, status: WorkItem['status']) => {
    setWorkItems(workItems.map(item => 
      item.id === id 
        ? { ...item, status, updatedAt: new Date().toISOString() }
        : item
    ));
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'assign' && currentUser.role === 'admin' && (
          <WorkAssigning 
            currentUser={currentUser}
            onAddWork={addWorkItem}
          />
        )}
        
        {currentPage === 'assign' && currentUser.role === 'user1' && (
          <WorkAssigning 
            currentUser={currentUser}
            onAddWork={addWorkItem}
          />
        )}
        
        {(currentPage === 'assign' && (currentUser.role === 'user2' || currentUser.role === 'user3')) && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">Access Denied</div>
            <p className="text-gray-600">You don't have permission to assign work.</p>
          </div>
        )}
        
        {currentPage === 'status' && (
          <WorkStatus 
            currentUser={currentUser}
            workItems={workItems}
            onUpdateStatus={updateWorkStatus}
          />
        )}
        
        {currentPage === 'reports' && currentUser.role === 'admin' && (
          <Reports 
            workItems={workItems}
            currentUser={currentUser}
          />
        )}
        
        {(currentPage === 'reports' && currentUser.role !== 'admin') && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">Access Denied</div>
            <p className="text-gray-600">Only administrators can view reports.</p>
          </div>
        )}
      </main>
    </div>
  );
}


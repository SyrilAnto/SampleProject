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
  role: 'admin' | 'employee';
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'assign' | 'status' | 'reports'>('assign');
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
      { username: 'user1', password: 'pass123', role: 'employee' as const },
      { username: 'user2', password: 'pass123', role: 'employee' as const },
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
    setCurrentPage('assign');
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
        {currentPage === 'assign' && (
          <WorkAssigning 
            currentUser={currentUser}
            onAddWork={addWorkItem}
          />
        )}
        
        {currentPage === 'status' && (
          <WorkStatus 
            currentUser={currentUser}
            workItems={workItems}
            onUpdateStatus={updateWorkStatus}
          />
        )}
        
        {currentPage === 'reports' && (
          <Reports 
            workItems={workItems}
            currentUser={currentUser}
          />
        )}
      </main>
    </div>
  );
}

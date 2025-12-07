import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Auth } from './pages/Auth';
import { ProjectList } from './pages/ProjectList';
import { PasswordGate } from './components/PasswordGate';
import { storageService } from './services/storageService';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogin = (user: User) => {
    setUser(user);
    window.location.hash = '#/projects';
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
    window.location.hash = '#/';
  };

  return (
    <PasswordGate>
      <Router>
        <Layout isAuthenticated={!!user} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={
              user ? <Navigate to="/projects" /> : <Landing onLogin={() => window.location.hash = '#auth'} />
            } />
            <Route path="/auth" element={
               user ? <Navigate to="/projects" /> : <Auth onLogin={handleLogin} />
            } />
            <Route path="/projects" element={
              user ? <ProjectList user={user} /> : <Navigate to="/auth" />
            } />
            <Route path="/project/:id" element={
              user ? <Dashboard /> : <Navigate to="/auth" />
            } />
          </Routes>
        </Layout>
      </Router>
    </PasswordGate>
  );
};

export default App;

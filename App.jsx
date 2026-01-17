import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { Landing } from './pages/Landing.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Auth } from './pages/Auth.jsx';
import { ProjectList } from './pages/ProjectList.jsx';
import { PasswordGate } from './components/PasswordGate.jsx';
import { useAuth } from './hooks/useAuth.js';

const App = () => {
  const { user, login, logout } = useAuth();

  const handleLogin = (user) => {
    login(user);
    window.location.hash = '#/projects';
  };

  const handleLogout = () => {
    logout();
    window.location.hash = '#/';
  };

  return (
    <PasswordGate>
      <Router>
        <Layout isAuthenticated={!!user} onLogout={handleLogout}>
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/projects" /> : <Landing onLogin={() => (window.location.hash = '#auth')} />}
            />
            <Route path="/auth" element={user ? <Navigate to="/projects" /> : <Auth onLogin={handleLogin} />} />
            <Route path="/projects" element={user ? <ProjectList user={user} /> : <Navigate to="/auth" />} />
            <Route path="/project/:id" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
          </Routes>
        </Layout>
      </Router>
    </PasswordGate>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/authContext';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import HomePage from './components/HomePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

const AppRoutes = () => {
  const { isAuthenticated, loading } = React.useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/home/*"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default App;

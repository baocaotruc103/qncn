import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/authContextBase';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PersonnelList from './pages/PersonnelList';
import PersonnelForm from './pages/PersonnelForm';
import PersonnelDetail from './pages/PersonnelDetail';

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <AdminLayout />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<Dashboard />} />
            <Route path="personnel" element={<PersonnelList />} />
            <Route path="personnel/new" element={<PersonnelForm />} />
            <Route path="personnel/edit/:id" element={<PersonnelForm />} />
            <Route path="personnel/view/:id" element={<PersonnelDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  // Si no hay token, redirigir a /auth
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // Si hay token, mostrar el contenido
  return children;
}

export default ProtectedRoute;
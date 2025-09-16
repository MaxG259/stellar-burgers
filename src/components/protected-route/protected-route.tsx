import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const location = useLocation();

  if (onlyUnAuth && isAuthenticated) {
    // Если роут только для неавторизованных, а пользователь авторизован
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    // Если роут защищённый, а пользователь НЕ авторизован
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

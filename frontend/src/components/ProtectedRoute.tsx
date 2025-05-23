
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ children, redirectPath = "/login", authenticated = false }: { children: React.ReactNode, redirectPath?: string, authenticated?: boolean }) {
    // const { authenticated } = useAppSelector(state => state.auth);
    if (!authenticated) {
        return <Navigate to={redirectPath} replace />
    }

    return children ? children : <Outlet />

}

export default ProtectedRoute
import { Navigate, useLocation } from "react-router-dom";
import { authStore } from "../../../Redux/AuthState";
import "./RequireAuth.css";

interface RequireAuthProps {
    children: JSX.Element
}

function RequireAuth(props: RequireAuthProps): JSX.Element {

    const location = useLocation()

    return (
        authStore.getState().token ? props.children : <Navigate to="/login" replace state={{ path: location.pathname }} />
    );
}

export default RequireAuth;

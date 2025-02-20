import { Navigate, useLocation } from "react-router-dom";

import PropTypes from "prop-types";
import useAuth from "../Hooks/useAuth";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    if (loading) {
        return <div className="my-36 w-full flex-col justify-center text-center items-center">
            <progress className="progress w-56"></progress>
            <p className="mt-4 text-gray-600">Loading, please wait...</p>
        </div>
    }
    if (user) {
        return children
    }
    return <Navigate to={'/login'} state={{ from: location }} replace></Navigate>
};

export default PrivateRoute;
PrivateRoute.propTypes = {
    children: PropTypes.node
}
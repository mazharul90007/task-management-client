import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "../Pages/Home/Navbar/Navbar";
import useAuth from "../Hooks/useAuth";


const MainLayout = () => {
    const {dayTheme} = useAuth()
    return (
        <div className={`${dayTheme ? 'bg-blue-50' : 'bg-gray-700'} min-h-screen`}>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <ToastContainer />
        </div>
    );
};

export default MainLayout;
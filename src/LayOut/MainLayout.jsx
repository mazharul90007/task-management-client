import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "../Pages/Home/Navbar/Navbar";


const MainLayout = () => {
    return (
        <div className="bg-blue-50 min-h-screen">
            <Navbar></Navbar>
            <Outlet></Outlet>
            <ToastContainer />
        </div>
    );
};

export default MainLayout;
import logo from "../../../../public/logo.png"
import { MdOutlineLogout } from "react-icons/md";
import useAuth from "../../../Hooks/useAuth";

const Navbar = () => {
    const { setUser, logOut } = useAuth();

    //Logout User
    const handleLogOut = () => {
        logOut()
            .then(() => {
                setUser(null);
            })
            .catch(error => {
                console.log(error);
            });
    };
    return (
        <div className="bg-blue-100 shadow">
            <div className="py-2 w-11/12 mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <img src={logo} alt="TaskImg" className="w-10 h-10" />
                    <p className="text-xl font-bold text-teal-600">Takify</p>
                </div>
                <div>
                    <button onClick={handleLogOut} className="text-2xl bg-white p-1 border rounded border-gray-300 shadow-lg text-teal-600 font-bold cursor-pointer hover:bg-teal-500 hover:text-white"><MdOutlineLogout /></button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
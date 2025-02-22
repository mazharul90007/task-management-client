import logo from "../../../../public/logo.png"
import { MdOutlineLogout } from "react-icons/md";
import useAuth from "../../../Hooks/useAuth";
import { FaMoon, FaSun } from "react-icons/fa";

const Navbar = () => {
    const { setUser, logOut, dayTheme, setDayTheme } = useAuth();

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
                    <p className="text-xl font-bold text-teal-600">Taskify</p>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setDayTheme(!dayTheme)} className={`text-2xl border p-1 rounded border-gray-300 shadow hover:bg-teal-500 hover:scale-110 transition-transform transform ${dayTheme ? 'bg-white' : 'text-white bg-black'}`}>
                        {dayTheme ? <FaMoon className="text-black" /> : <FaSun />}
                    </button>
                    <button onClick={handleLogOut} className="text-2xl bg-white p-1 border rounded border-gray-300 shadow-lg text-teal-600 font-bold cursor-pointer hover:bg-teal-500 hover:text-white"><MdOutlineLogout /></button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
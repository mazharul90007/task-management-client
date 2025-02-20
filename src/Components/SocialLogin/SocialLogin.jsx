import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAuth from "../../Hooks/useAuth";

const SocialLogin = () => {
    const { googleSignUp } = useAuth();
    const axiosPublic = useAxiosPublic();

    const handleGoogleSignUp = () => {
        googleSignUp()
            .then(result => {
                const userInfo = {
                    email: result.user?.email,
                    name: result.user?.displayName,
                };
                return axiosPublic.post('/users', userInfo);
            })
            .then(() => {
                // console.log(res.data);
                
            })
            .catch(() => {
                // console.error(error);
                toast.error("Google sign-in failed. Please try again.");
            });
    };

    return (
        <div>
            <button
                onClick={handleGoogleSignUp}
                aria-label="Sign Up with Google"
                className="py-2 px-3 border border-amber-500 rounded flex mx-auto shadow text-gray-500 bg-amber-50 w-full justify-center items-center gap-2 font-medium hover:scale-95 transition-transform transform duration-300"
            >
                <FcGoogle className="text-2xl" />
                Login
            </button>
        </div>
    );
};

export default SocialLogin;

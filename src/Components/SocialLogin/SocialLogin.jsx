import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAuth from "../../Hooks/useAuth";

const SocialLogin = () => {
    const { googleSignUp } = useAuth();
    const axiosPublic = useAxiosPublic();

    const handleGoogleSignUp = async () => {
        try {
            // Sign in with Google
            const result = await googleSignUp();

            // Prepare user data
            const userInfo = {
                email: result.user?.email,
                name: result.user?.displayName,
                uid: result.user?.uid,
            };

            // Send user data to the backend
            const res = await axiosPublic.post("/users", userInfo);

            // Check if the user was successfully stored in the database
            if (res.data.insertedId) {
                toast.success("Login successful!");
                // console.log("Registration successful");
            } else {
                toast.error("Failed to store user details.");
            }
        } catch (error) {
            console.error("Google sign-in failed:", error);
            toast.error("Google sign-in failed. Please try again.");
        }
    };

    return (
        <div>
            <button
                onClick={handleGoogleSignUp}
                aria-label="Sign Up with Google"
                className="py-2 px-3 border border-gray-400 rounded flex mx-auto shadow-md text-gray-500 bg-white w-full justify-center items-center gap-2 font-medium hover:scale-95 transition-transform transform duration-300"
            >
                <FcGoogle className="text-2xl" />
                Login
            </button>
        </div>
    );
};

export default SocialLogin;
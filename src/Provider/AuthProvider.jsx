import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut} from "firebase/auth";
import auth from "../../firebase.config";

export const AuthContext = createContext(null)
const AuthProvider = ({children}) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const googleProvider = new GoogleAuthProvider;

    //Create or Register a User
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }

    //Signin User
    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    }

    //google signin
    const googleSignUp = () => {
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
    }

    //LogOut
    const logOut = () => {
        setLoading(true);
        localStorage.removeItem('access-token');
        setLoading(false)

        return signOut(auth)
    }

    //Observe current User Existence
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
            setUser(currentUser)
            if(currentUser){
                console.log(currentUser);
                setLoading(false)
            }
            setLoading(false)
        })

        return ()=> unsubscribe();
    },[])

    const authInfo = {
        createUser,
        signIn,
        googleSignUp,
        logOut,
        user,
        loading


    }
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
AuthProvider.propTypes = {
    children: PropTypes.node
}
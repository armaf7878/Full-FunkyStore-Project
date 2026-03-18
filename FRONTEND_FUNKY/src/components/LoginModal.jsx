import { useState } from "react"
import { Account_Login } from "../app/api";
import { useNavigate } from "react-router-dom";

function LoginModal({onClose, onSwitchToRegister}){
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const Click_Login = () => {
        if(!email || !password){
            return setError("Please fill all fields");
        }
        setLoading(true);
        console.log("=== LOGIN DEBUG (LoginModal) ===");
        console.log("Email:", email);
        Account_Login(email, password)
        .then((res) => {
            console.log("Login response:", res);
            console.log("Token (res.data):", res.data);
            localStorage.setItem("token", res.data);
            console.log("Token saved to localStorage");
            setLoading(false);
            onClose();
            window.location.reload();
        })
        .catch((err) => {
            console.error("Login error:", err);
            setError(err.response?.data?.err || err.response?.data || "Login failed");
            setLoading(false);
        });
    };

    
    return(
        <>
            <div id="login_modal" className="absolute z-50 flex items-center justify-around w-full h-full animate-in fade-in zoom-in duration-300">
                <div  className="glass flex flex-col justify-around w-auto gap-4 p-8 rounded-2xl shadow-2xl min-w-[380px]">
                    <p 
                        className="text-4xl font-medium text-right cursor-pointer font-Genos text-n-100 hover:text-p-50 transition-colors"
                        onClick={onClose}
                    >✕
                    </p>
                    <p className="text-4xl font-medium font-Genos text-n-100 text-center mb-4">Welcome Back</p>
                    
                    <div className="space-y-4">
                        <input 
                            className="w-full h-12 px-4 font-light bg-n-300/80 rounded-2xl text-n-100 font-Genos input-premium"
                            placeholder="Email address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        
                        <input 
                            className="w-full h-12 px-4 font-light bg-n-300/80 rounded-2xl text-n-100 font-Genos input-premium"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <p className="text-lg font-light font-Genos text-n-50 cursor-pointer hover:text-n-100 transition-colors underline decoration-n-50/30 underline-offset-4">Forgot Password?</p>
                        <button 
                            className="px-8 py-2 text-2xl cursor-pointer bg-p-50 rounded-2xl text-n-300 font-Genos btn-premium flex items-center justify-center min-w-[100px]"
                            onClick={Click_Login}
                            disabled={loading}
                            >
                            {loading ? <div className="spinner"></div> : "Login"}  
                        </button>
                    </div>

                    <p 
                        className="text-lg font-light font-Genos text-n-50 cursor-pointer hover:text-p-50 transition-colors text-center mt-4"
                        onClick={onSwitchToRegister}
                    >
                        Don't have an account? <span className="text-p-50 font-medium">Sign Up</span>
                    </p>

                    {error!=""?<p className="font-light text-red-500 text-center text-md font-Genos bg-red-500/10 py-2 rounded-lg mt-2">{error}</p>:""}
                </div>
            </div>
        </>
    )
}; export default LoginModal
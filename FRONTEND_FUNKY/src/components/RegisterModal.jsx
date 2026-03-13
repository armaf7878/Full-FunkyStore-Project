import { useState } from "react"
import { Account_Register } from "../app/api";

function RegisterModal({onClose, onSwitchToLogin}){
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const Click_Register = () => {
        if(!fullname || !email || !password || !phone){
            return setError("Please fill all fields");
        }
        setLoading(true);
        setError("");
        
        Account_Register(fullname, email, password, phone)
        .then((res) => {
            setLoading(false);
            setSuccess(true);
            setTimeout(() => {
                onSwitchToLogin();
            }, 2000);
        })
        .catch((err) => {
            console.error("Register error:", err);
            setError(err.response?.data?.error || err.response?.data || "Registration failed");
            setLoading(false);
        });
    };

    return(
        <>
            <div id="register_modal" className="absolute z-50 flex items-center justify-around w-full h-full animate-in fade-in zoom-in duration-300">
                <div  className="glass flex flex-col justify-around w-auto gap-4 p-8 rounded-2xl shadow-2xl min-w-[400px]">
                    <p 
                        className="text-4xl font-medium text-right cursor-pointer font-Genos text-n-100 hover:text-p-50 transition-colors"
                        onClick={onClose}
                    >✕
                    </p>
                    <p className="text-4xl font-medium font-Genos text-n-100 text-center mb-2">Create Account</p>
                    
                    {success ? (
                        <div className="text-green-400 font-Genos text-xl text-center py-8 bg-green-500/10 rounded-xl border border-green-500/20">
                            <div className="flex justify-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            Account created successfully!<br/>Redirecting to login...
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3">
                                <input 
                                    className="w-full h-12 px-4 font-light bg-n-300/80 rounded-2xl text-n-100 font-Genos input-premium"
                                    placeholder="Full Name"
                                    type="text"
                                    value={fullname}
                                    onChange={(e) => setFullname(e.target.value)}
                                />
                                <input 
                                    className="w-full h-12 px-4 font-light bg-n-300/80 rounded-2xl text-n-100 font-Genos input-premium"
                                    placeholder="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <input 
                                    className="w-full h-12 px-4 font-light bg-n-300/80 rounded-2xl text-n-100 font-Genos input-premium"
                                    placeholder="Phone Number"
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <input 
                                    className="w-full h-12 px-4 font-light bg-n-300/80 rounded-2xl text-n-100 font-Genos input-premium"
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <p 
                                    className="text-lg font-light font-Genos text-n-50 cursor-pointer hover:text-n-100 transition-colors"
                                    onClick={onSwitchToLogin}
                                >
                                    Have an account? <span className="text-p-50">Login</span>
                                </p>
                                <button 
                                    className="px-8 py-2 text-2xl cursor-pointer bg-p-50 rounded-2xl text-n-300 font-Genos btn-premium flex items-center justify-center min-w-[120px]"
                                    onClick={Click_Register}
                                    disabled={loading}
                                    >
                                    {loading ? <div className="spinner border-n-300 border-t-n-100"></div> : "Sign Up"}  
                                </button>
                            </div>

                            {error!=""?<p className="font-light text-red-500 text-center text-md font-Genos bg-red-500/10 py-2 rounded-lg mt-2">{error}</p>:""}
                        </>
                    )}
                </div>
            </div>
        </>
    )
}; export default RegisterModal

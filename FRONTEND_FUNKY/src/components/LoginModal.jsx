import { useState } from "react"
import { Account_Login } from "../app/api";

function LoginModal({onClose}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const Click_Login = () => {
        if(!email || !password){
            return setError("Please fill all fields");
        }
        Account_Login(email, password)
        .then((res) => {
            localStorage.setItem("token", res.data);
            console.log("Login successfully");
            onClose();
        })
        .catch((err) =>  setError(err.response.data));
    };

    
    return(
        <>
            <div id="login_modal" className="absolute z-50 flex items-center justify-around w-full h-full">
                <div  className="flex flex-col justify-around w-auto gap-4 p-4 h-84 bg-n-50">
                    <p 
                        className="text-4xl font-medium text-right cursor-pointer font-Genos text-n-300"
                        onClick={onClose}
                    >X
                    </p>
                    <p className="text-4xl font-medium font-Genos text-n-300">Sign In For More Discount</p>
                    <input 
                        className="w-full h-12 px-4 font-light bg-n-300 rounded-2xl text-n-100 font-Genos"
                        placeholder="Email..."
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    
                    <input 
                        className="w-full h-12 px-4 font-light bg-n-300 rounded-2xl text-n-100 font-Genos"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="flex items-center justify-between">
                        <p className="text-lg font-light font-Genos text-n-300">*Forget Password</p>
                        <button 
                            className="px-4 py-2 text-2xl cursor-pointer bg-n-300 rounded-2xl text-n-100 font-Genos hover:bg-n-300/80"
                            onClick={Click_Login}
                            >Login  
                        </button>
                    </div>

                    {error!=""?<p className="font-light text-red-500 shadow-xl text-md font-Genos">{error}</p>:""}
                </div>
                
                
            </div>
        </>
    )
}; export default LoginModal
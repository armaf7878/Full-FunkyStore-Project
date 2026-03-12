import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/Logo.png";
import icon_cart from "../assets/icon_cart.png";

function Header(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setShowUserMenu(false);
        window.location.href = "/";
    };

    return(
    <>
        <section id="Header" className="absolute top-0 z-50 flex items-center justify-between w-full h-20 pt-2 ">
            <div className="flex items-center h-full">
                <img src={logo} alt="logo" className="object-contain h-full cursor-pointer"/>
                <Link to='/' className="text-2xl font-Jaro text-n-100">Funky Store</Link>
            </div>

            <div className="flex items-center mr-4 gap-x-4">
                <Link to='/' className="text-xl font-Jaro text-n-100">Home</Link>
                <Link to='/order' className="text-xl font-Jaro text-n-50">Order</Link>
                <Link to='/collection' className="text-xl font-Jaro text-n-50">Collection</Link>
                <Link to='/shop' className="text-xl font-Jaro text-n-50">Shop</Link>
                <Link to='/cart'>
                    <img src={icon_cart} alt="Find a item" className="scale-70"/>
                </Link>
                
                {isLoggedIn ? (
                    <div className="relative">
                        <button 
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 px-3 py-1 text-xl font-Jaro text-n-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-n-50 border border-n-200 rounded-lg shadow-xl">
                                <Link 
                                    to="/order/history" 
                                    className="block px-4 py-2 text-n-100 hover:bg-n-200 font-Genos"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    My Orders
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-n-100 hover:bg-n-200 font-Genos"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button 
                        onClick={() => setOpenLogin(true)}
                        className="text-xl font-Jaro text-n-50 hover:text-n-100"
                    >
                        Login
                    </button>
                )}
                
            </div>
        </section> 
        {openLogin && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
                <LoginModalWrapper onClose={() => setOpenLogin(false)} setIsLoggedIn={setIsLoggedIn} />
            </div>
        )}
    </>
    )
}

function LoginModalWrapper({ onClose, setIsLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            return setError("Please fill all fields");
        }
        setLoading(true);
        console.log("=== LOGIN DEBUG ===");
        console.log("API URL:", `${import.meta.env.VITE_API_URL}/user/login`);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            console.log("Login response status:", res.status);
            console.log("Login response data:", data);
            if (res.ok) {
                console.log("Token to save:", data.data);
                localStorage.setItem("token", data.data);
                setIsLoggedIn(true);
                onClose();
                window.location.reload();
            } else {
                setError(data.err || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Connection error");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col justify-around w-auto gap-4 p-8 h-84 bg-n-50 border border-n-200 rounded-xl">
            <p 
                className="text-2xl font-medium text-right cursor-pointer font-Genos text-n-300"
                onClick={onClose}
            >X</p>
            <p className="text-3xl font-medium font-Genos text-n-100 text-center">Sign In</p>
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
                <p className="text-lg font-light font-Genos text-n-300 cursor-pointer">Forgot Password?</p>
                <button 
                    className="px-6 py-2 text-2xl cursor-pointer bg-n-300 rounded-2xl text-n-100 font-Genos hover:bg-n-300/80 disabled:opacity-50"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? "..." : "Login"}  
                </button>
            </div>
            {error && <p className="font-light text-red-500 text-md font-Genos">{error}</p>}
        </div>
    );
}

export default Header
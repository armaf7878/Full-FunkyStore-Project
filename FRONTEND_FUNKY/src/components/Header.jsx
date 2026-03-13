import { NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Cart_GetCart } from "../app/api";
import logo from "../assets/Logo.png";
import icon_cart from "../assets/icon_cart.png";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

function Header(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [openAuth, setOpenAuth] = useState(false);
    const [authMode, setAuthMode] = useState("login"); // "login" or "register"

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

    const navLinkClass = ({ isActive }) => 
        `text-xl font-Jaro transition-all duration-300 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-p-50 after:transition-transform after:duration-300 ${
            isActive ? "text-p-50 after:scale-x-100" : "text-n-50 hover:text-n-100 after:scale-x-0"
        }`;

    return(
    <>
        <section id="Header" className="absolute top-0 z-50 flex items-center justify-between w-full h-20 pt-2 px-8">
            <div className="flex items-center h-full">
                <Link to='/' className="flex items-center h-full">
                    <img src={logo} alt="logo" className="object-contain h-full cursor-pointer"/>
                    <span className="text-2xl font-Jaro text-n-100 ml-2">Funky Store</span>
                </Link>
            </div>

            <div className="flex items-center gap-x-8">
                <nav className="flex items-center gap-x-6">
                    <NavLink to='/' className={navLinkClass}>Home</NavLink>
                    <NavLink to='/order' className={navLinkClass}>Order</NavLink>
                    <NavLink to='/collection' className={navLinkClass}>Collection</NavLink>
                    <NavLink to='/shop' className={navLinkClass}>Shop</NavLink>
                </nav>
                
                <Link to='/cart' className="relative hover:scale-110 transition-transform">
                    <img src={icon_cart} alt="Find a item" className="w-8 h-8"/>
                    {isLoggedIn && (
                        <CartBadge />
                    )}
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
                        onClick={() => {
                            setAuthMode("login");
                            setOpenAuth(true);
                        }}
                        className="text-xl font-Jaro text-n-50 hover:text-n-100"
                    >
                        Login
                    </button>
                )}
                
            </div>
        </section> 
        {openAuth && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
                {authMode === "login" ? (
                    <LoginModal 
                        onClose={() => setOpenAuth(false)} 
                        onSwitchToRegister={() => setAuthMode("register")}
                    />
                ) : (
                    <RegisterModal 
                        onClose={() => setOpenAuth(false)} 
                        onSwitchToLogin={() => setAuthMode("login")}
                    />
                )}
            </div>
        )}
    </>
    )
}

const CartBadge = () => {
    const [count, setCount] = useState(0);

    const updateCount = () => {
        Cart_GetCart()
            .then(res => {
                const total = Array.isArray(res) ? res.reduce((acc, item) => acc + item.quantity, 0) : 0;
                setCount(total);
            })
            .catch(() => setCount(0));
    };

    useEffect(() => {
        updateCount();
        const interval = setInterval(updateCount, 5000); // 5s update
        return () => clearInterval(interval);
    }, []);

    if (count === 0) return null;

    return (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-p-50 text-[10px] font-extrabold text-n-300 shadow-lg ring-2 ring-n-300 animate-pulse">
            {count}
        </span>
    );
};

export default Header;
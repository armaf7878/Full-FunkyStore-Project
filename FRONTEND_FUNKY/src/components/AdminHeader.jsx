import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Logo.png";

function AdminHeader() {

    const location = useLocation();

    const menu = [
        {name: "Dashboard", path: "/admin"},
        {name: "Users", path: "/admin/users"},
        {name: "Orders", path: "/admin/orders"},
        {name: "Products", path: "/admin/products"},
        {name: "Categories", path: "/admin/categories"},
        {name: "Reports", path: "/admin/reports"}
    ];

    return(
        <header className="fixed top-0 z-50 flex items-center justify-between w-full h-20 px-10 border-b bg-[#020B0A] border-n-200 font-Genos">

            <div className="flex items-center gap-3">

                <img 
                    src={logo} 
                    alt="logo"
                    className="object-contain h-12"
                />

                <Link 
                    to="/admin/dashboard"
                    className="text-2xl text-n-100"
                >
                    Funky Admin
                </Link>

            </div>

            <nav className="flex items-center gap-8">

                {menu.map((item)=>{

                    const active = location.pathname.startsWith(item.path);

                    return(
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`text-lg transition ${
                                active 
                                ? "text-n-100 border-b-2 border-n-100 pb-1"
                                : "text-n-50 hover:text-n-100"
                            }`}
                        >
                            {item.name}
                        </Link>
                    )
                })}

            </nav>

            <div className="flex items-center gap-4">

                <button
                    className="px-4 py-2 text-sm transition border rounded-lg border-n-200 text-n-50 hover:text-n-100 hover:border-n-100"
                    onClick={()=>{
                        localStorage.removeItem("token");
                        window.location.href = "/";
                    }}
                >
                    Logout
                </button>

            </div>

        </header>
    )
}

export default AdminHeader;
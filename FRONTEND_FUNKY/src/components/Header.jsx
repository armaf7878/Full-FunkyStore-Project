import { Link } from "react-router-dom";
import logo from "../assets/Logo.png";
import icon_cart from "../assets/icon_cart.png";
function Header(){
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
                
            </div>
        </section> 
    </>
    )
}export default Header
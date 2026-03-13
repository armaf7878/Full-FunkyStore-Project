import Hoodie from "../assets/Hodie/hoodie_1.png"
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import { Product_ShowAll } from "../app/api";
import { Product_GetProduct } from "../app/api"
import { Cart_AddTo } from "../app/api";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
function Product_Detail(){
    const {id} = useParams()
    const [product, setProduct] = useState([]);
    const [allProduct, setAllProduct] = useState([]);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [chooseProduct, setChooseProduct] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [openAuth, setOpenAuth] = useState(false);
    const [authMode, setAuthMode] = useState("login");

    const colors = [...new Set(product.map(v => v.color))];
    const availableSizes = product
        .filter(v => v.color === selectedColor)
        .map(v => v.size);

    useEffect(() => {
        if (product.length > 0) {
            if (!selectedColor) setSelectedColor(product[0].color);
            if (!selectedSize && availableSizes.length > 0) {
                const firstAvailable = product.find(v => v.color === selectedColor && v.stock > 0);
                if (firstAvailable) {
                    setSelectedSize(firstAvailable.size);
                    setChooseProduct(firstAvailable._id);
                }
            }
        }
    }, [product, selectedColor]);

    const handleSelectColor = (color) => {
        setSelectedColor(color);
        const sizesForColor = product.filter(v => v.color === color);
        const firstAvailable = sizesForColor.find(v => v.stock > 0);
        if (firstAvailable) {
            setSelectedSize(firstAvailable.size);
            setChooseProduct(firstAvailable._id);
        } else {
            setSelectedSize("");
            setChooseProduct("");
        }
    }

    const handleSelectSize = (size) => {
        setSelectedSize(size);
        const variant = product.find(v => v.color === selectedColor && v.size === size);
        if (variant) {
            setChooseProduct(variant._id);
        }
    }

    const add_to_cart = (redirect = false) => {
        if(!chooseProduct){
            return alert("Hey yo, i can't get your size bro !");
        };

        Cart_AddTo(chooseProduct, quantity)
        .then((res) => {
            if (redirect) {
                window.location.href = "/cart";
            } else {
                alert("I throw one more items in your cart, bro!");
            }
        })
        .catch((err) => {
            if(err.response?.data?.err == "You are not authenticated !"){
                setOpenAuth(true);
            }
            else if(err.response?.data?.err == "Token is not valid"){
                alert("Token expired, please login again !");
                setOpenAuth(true);
            }
            else{
                alert(err.response?.data?.err || "Something went wrong, bro!");
            }
        });
    };

    const loadProduct = async(id) => {
        await Product_GetProduct(id)
        .then((product) => setProduct(product))
        .catch((err) => console.log(err))
    }

    const load_AllProduct = () => {
        Product_ShowAll()
        .then((products) => setAllProduct(products))
        .catch((err) => console.log(err));
    }

    useEffect(() => {
        loadProduct(id);
        load_AllProduct();
    }, [id])
    
    if (product.length == 0) return <div className="flex items-center justify-center w-full h-screen text-2xl font-Genos text-n-100">Loading...</div>;

    const currentVariant = product.find(v => v._id === chooseProduct) || product[0];

    return(
        <>
            <section id="page-2" className="relative w-full h-screen pt-20 ">
                {openAuth && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
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
                
                <p id="product_name" className="w-full pl-8 pr-8 text-5xl font-medium text-center font-Genos text-n-100 uppercase tracking-widest">{product[0].productId.product_Name}</p>
                
                <div className="flex items-center justify-between h-full pl-8 pr-8">
                    <div id="page-count" className="flex flex-col gap-4 w-30">
                        <div className="w-23 h-1.25 rounded-2xl bg-n-50"></div>
                        <div className="w-30 h-1.25 rounded-2xl bg-n-100"></div>
                        <div className="w-23 h-1.25 rounded-2xl bg-n-50"></div>
                        <div className="w-23 h-1.25 rounded-2xl bg-n-50"></div>
                    </div>

                    <div className="relative flex items-center justify-center w-full h-full max-w-2xl">
                        <img 
                            src={product[0].productId.image[0]} 
                            className="object-contain w-full h-auto max-h-[70vh] drop-shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-transform duration-500 hover:scale-105"
                            alt={product[0].productId.product_Name}
                        />
                    </div>

                    <div id="Buy_NewArrival" className="flex items-center">
                        <div className="flex flex-col gap-6 p-8 w-100 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                            {/* Color Selection */}
                            <div>
                                <p className="mb-3 text-xl font-medium tracking-wider font-Genos text-n-100/60 uppercase">COLOR</p>
                                <div className="flex flex-wrap gap-3">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => handleSelectColor(color)}
                                            className={`px-4 py-1.5 rounded-full border-2 font-Genos text-lg transition-all ${
                                                selectedColor === color 
                                                ? "bg-p-50 border-p-50 text-n-300 shadow-[0_0_15px_rgba(var(--p-50-rgb),0.5)]" 
                                                : "border-white/20 text-n-100 hover:border-white/40 bg-white/5"
                                            }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div>
                                <p className="mb-3 text-xl font-medium tracking-wider font-Genos text-n-100/60 uppercase">SIZE</p>
                                <div className="grid grid-cols-4 gap-3">
                                    {product.filter(v => v.color === selectedColor).map((v) => (
                                        <button
                                            key={v._id}
                                            disabled={v.stock === 0}
                                            onClick={() => handleSelectSize(v.size)}
                                            className={`h-12 flex items-center justify-center rounded-xl border-2 font-Genos text-xl transition-all ${
                                                v.stock === 0 
                                                ? "opacity-30 cursor-not-allowed border-white/5 text-n-100/30" 
                                                : selectedSize === v.size
                                                    ? "bg-white text-n-300 border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                                    : "border-white/20 text-n-100 hover:border-white/40 hover:bg-white/5"
                                            }`}
                                        >
                                            {v.size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div>
                                <p className="mb-3 text-xl font-medium tracking-wider font-Genos text-n-100/60 uppercase">QUANTITY</p>
                                <div className="flex items-center gap-4 bg-white/5 rounded-xl border border-white/10 p-1 w-fit">
                                    <button 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-2xl text-n-100 hover:bg-white/10 rounded-lg transition-colors border border-transparent"
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center text-xl font-Genos text-n-100">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(Math.min(currentVariant.stock, quantity + 1))}
                                        className="w-10 h-10 flex items-center justify-center text-2xl text-n-100 hover:bg-white/10 rounded-lg transition-colors border border-transparent"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Price and Actions */}
                            <div className="pt-4 mt-2 border-t border-white/10">
                                <div className="flex items-end justify-between mb-6">
                                    <p className="text-xl font-Genos text-n-100/60 font-light">Price</p>
                                    <p className="text-5xl font-extrabold font-Genos text-p-50 drop-shadow-[0_0_10px_rgba(var(--p-50-rgb),0.3)]">${currentVariant.price}</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button 
                                        onClick={() => add_to_cart(false)}
                                        className="group relative h-14 w-full flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-p-50 font-Genos text-2xl font-medium text-n-300 transition-all hover:bg-p-50/90 active:scale-95 shadow-lg shadow-p-50/20"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        ADD TO CART
                                    </button>
                                    <button 
                                        onClick={() => add_to_cart(true)}
                                        className="h-14 w-full flex items-center justify-center rounded-xl border border-white/20 bg-white/5 font-Genos text-2xl font-light text-n-100 transition-all hover:bg-white/10 hover:border-white/40 active:scale-95"
                                    >
                                        BUY NOW
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
  

            <section id="relative-items" className="w-full h-auto pt-20 pl-8 pr-8">
                <div className="flex items-center justify-between">
                    <p className="text-3xl text-left w-70 font-Jaro text-n-100">Relative Items</p>
                    <div className="w-full h-1 rounded-2xl bg-n-50"></div>
                </div>

                <div className="flex items-center justify-around w-full h-84 ">{allProduct.filter((product_filter) => product_filter.categoryId._id == product[0].productId.categoryId).slice(0,3).map((product_filter) => (
                    <Link to={`/shop/${product_filter._id}`} className="h-full">
                        <img 
                            key={product_filter._id} 
                            src={product_filter.image[0]} 
                            className="object-contain w-auto h-full cursor-pointer hover:-translate-y-1"
                             />
                    </Link>
                ))}
                </div>    
            </section>
        </>
    )
}export default Product_Detail
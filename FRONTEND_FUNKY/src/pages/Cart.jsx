import { useEffect, useState } from "react"
import { Cart_GetCart , Product_ShowAllVariable, Cart_Delete} from "../app/api"
import { Link } from "react-router-dom";
import icon_trash from "../assets/icon_trash.png";
function Cart(){
    const [carts, setCarts] = useState([]);
    const [productVariable, setProductVariable] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loadingCart, setLoadingCart] = useState(false);
    const [loadingVariable, setLoadingVariable] = useState(false);
    const [quantity, setQuantity] = useState();
    const [total, setTotal] = useState(0);
    const loadCart = () => {
        Cart_GetCart()
        .then((res) => setCarts(res))
        .catch((err) => console.log(err.response))
        .finally(() => setLoadingCart(true))
    };

    const loadProductVariable = () => {
        Product_ShowAllVariable()
        .then((res) => setProductVariable(res))
        .catch((err) => console.log(err))
        .finally(() => setLoadingVariable(true));
    };

    const onQuantity = (type) => {
        if(type = "increase"){

        };
        if(type = "decrease"){

        };
    }

    const onDelete = (cart_id) => {
        Cart_Delete(cart_id)
        .then((res) => setCarts(prev => prev.filter(cart => cart._id !== cart_id)))
        .catch((err) => console.log(err.response))
    }

   const onProduct = () => {
        console.log("=== CART CHECKOUT DEBUG ===");
        console.log("selectedProducts:", selectedProducts);
        localStorage.setItem("products_Checkout", JSON.stringify(selectedProducts));
        console.log("products_Checkout saved:", localStorage.getItem("products_Checkout"));
    }

    useEffect(() =>{
        localStorage.removeItem("products_Checkout");
        loadCart();
        loadProductVariable();
    }, [])

    if(!loadingCart && !loadingVariable){return <p className="pt-20 text-2xl text-center font-Genos text-n-100"> Loading Cart Items...</p>}
    console.log(productVariable);
    console.log(carts);
    return(
        <>
            <section id="cart" className="w-full h-auto pl-8 pr-8">
                <div className="flex items-center justify-between pt-40 ">
                    <p className="text-3xl text-left w-30 font-Jaro text-n-100">Carts</p>
                    <div className="w-full h-1 rounded-2xl bg-n-50"></div>
                </div>
                {carts.map(cart => (
                    productVariable.filter((product) => product._id.toString() == cart.product_variable.toString()).map((productFilter) => (
                            <div key={cart._id} className="flex items-center justify-between w-full gap-4 h-50">
                                <input 
                                    className="rounded-md appearance-none cursor-pointer bg-n-100 checked:bg-n-50 size-6" 
                                    type="checkbox"
                                    onChange={(e) => {
                                        if(e.target.checked == true){
                                            setTotal(prev => prev+=(cart.quantity*productFilter.price));
                                            setSelectedProducts((prev) => [...prev, [productFilter._id, cart.quantity]]);
                                        }
                                        else{
                                            setTotal(prev => prev-=(cart.quantity*productFilter.price));
                                            setSelectedProducts(prev => prev.filter(id => id[0] !== cart._id));
                                        }
                                    }}
                                    />
                                <img src={productFilter.productId.image[0]} className="object-contain w-auto h-full"/>
                                <div id="info_product">
                                    <p className="text-xl text-n-100 font-Genos">Name: {productFilter.productId.product_Name}</p>
                                    <p className="text-xl text-n-100 font-Genos">Size: {productFilter.size}</p>
                                    <p className="text-xl text-n-100 font-Genos">Price: {productFilter.price} $</p>
                                </div>
                                <div id="quantity" className="flex items-center h-full gap-x-4">
                                    <p className="text-5xl cursor-pointer font-Genos text-n-100">+</p>
                                    <p className="w-16 h-auto text-2xl text-center border-2 border-n-100 font-Genos rounded-xl text-n-100">{cart.quantity}</p>
                                    <p className="text-5xl cursor-pointer font-Genos text-n-100">-</p>
                                </div>
                                <p className="text-5xl text-n-100 font-Genos">{cart.quantity*productFilter.price}$</p>
                                <img src={icon_trash} className="object-contain cursor-pointer"
                                    onClick={() => onDelete(cart._id)}
                                />
                            </div>
                    ))
                ))}

                <div className="w-[30%] float-right h-1 rounded-2xl bg-n-50"></div>
                <p className="float-right w-full text-5xl text-right text-n-100 font-Genos">{total}$</p>
                <Link 
                    to="/order"
                    onClick={onProduct}>
                    <p className="float-right px-4 py-2 mt-4 text-5xl text-right cursor-pointer text-n-300 font-Genos rounded-2xl bg-n-100 hover:text-n-100 hover:bg-n-200">Checkout</p>
                </Link>
            </section> 
        </>
    )
}
export default Cart
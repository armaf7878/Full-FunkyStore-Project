import { useEffect, useState } from "react"
import { Cart_GetCart, Product_ShowAllVariable, Cart_Delete, Cart_UpdateQuantity } from "../app/api"
import { Link } from "react-router-dom";
import icon_trash from "../assets/icon_trash.png";

function Cart() {
    const [carts, setCarts] = useState([]);
    const [productVariable, setProductVariable] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]); // Array of {cartId, productVariableId, quantity, price}
    const [loadingCart, setLoadingCart] = useState(false);
    const [loadingVariable, setLoadingVariable] = useState(false);
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

    const handleUpdateQuantity = (cartId, newQuantity) => {
        if (newQuantity < 1) return;
        Cart_UpdateQuantity(cartId, newQuantity)
            .then(() => {
                setCarts(prev => prev.map(item =>
                    item._id === cartId ? { ...item, quantity: newQuantity } : item
                ));
                // Update total and selectedItems if this item is selected
                setSelectedItems(prev => prev.map(item =>
                    item.cartId === cartId ? { ...item, quantity: newQuantity } : item
                ));
            })
            .catch(err => alert(err.response?.data?.error || "Failed to update quantity"));
    }

    const onDelete = (cart_id) => {
        Cart_Delete(cart_id)
            .then(() => {
                setCarts(prev => prev.filter(cart => cart._id !== cart_id));
                setSelectedItems(prev => prev.filter(item => item.cartId !== cart_id));
            })
            .catch((err) => console.log(err.response))
    }

    const onCheckout = () => {
        // Map to format [product_variable_id, quantity] for backend
        const productsForOrder = selectedItems.map(item => [item.productVariableId, item.quantity]);
        localStorage.setItem("products_Checkout", JSON.stringify(productsForOrder));
    }

    useEffect(() => {
        localStorage.removeItem("products_Checkout");
        loadCart();
        loadProductVariable();
    }, [])

    useEffect(() => {
        const newTotal = selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setTotal(newTotal);
    }, [selectedItems]);

    const handleSelectItem = (cart, product, isChecked) => {
        if (isChecked) {
            setSelectedItems(prev => [...prev, {
                cartId: cart._id,
                productVariableId: product._id,
                quantity: cart.quantity,
                price: product.price
            }]);
        } else {
            setSelectedItems(prev => prev.filter(item => item.cartId !== cart._id));
        }
    }

    if (!loadingCart && !loadingVariable) {
        return <div className="flex items-center justify-center w-full h-screen text-2xl font-Genos text-n-100">Loading Cart Items...</div>
    }

    const totalItemsInCart = carts.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <>
            <section id="cart" className="w-full min-h-screen pl-8 pr-8 pb-20">
                <div className="flex items-center justify-between pt-40 mb-10">
                    <div className="flex items-baseline gap-4">
                        <p className="text-3xl font-Jaro text-n-100">My Cart</p>
                        <span className="px-3 py-1 text-sm rounded-full bg-p-50 text-n-300 font-Genos">
                            {carts.length} types / {totalItemsInCart} items
                        </span>
                    </div>
                    <div className="flex-1 h-1 ml-4 rounded-2xl bg-n-50/20"></div>
                </div>

                <div className="flex flex-col gap-6">
                    {carts.map(cart => {
                        const productFilter = productVariable.find(p => p._id.toString() === cart.product_variable.toString());
                        if (!productFilter) return null;

                        return (
                            <div key={cart._id} className="flex items-center justify-between w-full p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl group hover:border-white/20 transition-all">
                                <div className="flex items-center gap-6">
                                    <input
                                        className="w-6 h-6 rounded-md appearance-none cursor-pointer bg-white/10 border border-white/20 checked:bg-p-50 transition-colors"
                                        type="checkbox"
                                        checked={selectedItems.some(item => item.cartId === cart._id)}
                                        onChange={(e) => handleSelectItem(cart, productFilter, e.target.checked)}
                                    />
                                    <div className="relative w-32 h-32 overflow-hidden rounded-2xl bg-white/5">
                                        <img src={productFilter.productId.image[0]} className="object-contain w-full h-full p-2" alt="" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-2xl font-Genos text-n-100 uppercase tracking-wider">{productFilter.productId.product_Name}</p>
                                        <div className="flex items-center gap-4 text-n-100/60 font-Genos">
                                            <span>Size: <span className="text-n-100">{productFilter.size}</span></span>
                                            <span>Color: <span className="text-n-100">{productFilter.color}</span></span>
                                        </div>
                                        <p className="text-xl font-Genos text-p-50">${productFilter.price}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12">
                                    <div className="flex items-center gap-4 bg-white/5 rounded-xl border border-white/10 p-1">
                                        <button
                                            onClick={() => handleUpdateQuantity(cart._id, cart.quantity - 1)}
                                            className="w-10 h-10 flex items-center justify-center text-2xl text-n-100 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            −
                                        </button>
                                        <span className="w-8 text-center text-xl font-Genos text-n-100">{cart.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(cart._id, cart.quantity + 1)}
                                            className="w-10 h-10 flex items-center justify-center text-2xl text-n-100 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <p className="w-32 text-4xl text-right font-Genos text-n-100">${(cart.quantity * productFilter.price).toFixed(2)}</p>

                                    <button
                                        onClick={() => onDelete(cart._id)}
                                        className="p-3 rounded-xl hover:bg-red-500/10 transition-colors group/delete"
                                    >
                                        <img src={icon_trash} className="w-6 h-6 opacity-40 group-hover/delete:opacity-100 transition-opacity" alt="delete" />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {carts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-n-100/40 font-Genos">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-2xl">Your cart is empty</p>
                        <Link to="/shop" className="mt-4 text-p-50 hover:underline">Continue Shopping</Link>
                    </div>
                )}

                {carts.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-end gap-6">
                        <div className="flex items-baseline gap-6 text-n-100">
                            <p className="text-2xl font-Genos font-light opacity-60">Total Amount</p>
                            <p className="text-6xl font-Genos text-p-50 font-bold">${total.toFixed(2)}</p>
                        </div>

                        <Link
                            to={selectedItems.length > 0 ? "/order" : "#"}
                            onClick={onCheckout}
                            className={`px-12 py-4 text-3xl font-Genos rounded-2xl transition-all active:scale-95 ${selectedItems.length > 0
                                    ? "bg-p-50 text-n-300 hover:bg-p-50/90 shadow-lg shadow-p-50/20"
                                    : "bg-white/5 text-n-100/20 cursor-not-allowed border border-white/10"
                                }`}
                        >
                            Checkout ({selectedItems.length})
                        </Link>
                    </div>
                )}
            </section>
        </>
    )
}

export default Cart
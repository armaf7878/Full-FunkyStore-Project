import { useEffect, useState } from "react";
import { Product_Get1Variable, Order_Create } from "../app/api";
useState
function Home(){
    const [method, setMethod] = useState("");
    const [products, setProducts] = useState([]);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    
    const checkout_products = JSON.parse(localStorage.getItem("products_Checkout")) || [];
    
    const loadProducts = async () => {
        try {
            const results = await Promise.all(
                checkout_products.map(id => Product_Get1Variable(id[0]))
            );

            for(let i =0; i<results.length; i++){
                results[i][0]['quantity'] = checkout_products[i][1];
                console.log(results[i])
            }
            
            setProducts(results);
        } catch (err) {
            console.log(err);
        }
    };

    const onOrder = () => {
        if(address == "" || method =="" || phone == ""){
            return alert("Please Fill Full Information");
        }
        Order_Create(address, method, phone, checkout_products)
        .then((res) => {
            alert(res.message);
            window.location.href = "/";
            localStorage.removeItem("products_Checkout");
        })
        .catch((err) => {
            console.log(err.response);
            if(err.response.data.error != null){
                alert(err.response.data.error)
            }
            
        })
    }

    useEffect( () => {
        loadProducts();
    }, [])

    console.log(products);
    return(
    <>
        <section id="order" className="w-full h-auto pt-20 pl-8 pr-8">
            <div className="flex justify-between w-full h-auto">
                <div id="information-order" className="flex flex-col gap-8 w-[50%]">
                    <h1 className="text-3xl font-medium font-Genos text-n-100">Order Information</h1>
                    <input 
                        placeholder="Email..." 
                        type="email" 
                        className="px-4 py-2 border-2 rounded-md border-n-100 text-n-100 font-Genos"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    <input 
                        placeholder="Phone..." 
                        className="px-4 py-2 border-2 rounded-md border-n-100 text-n-100 font-Genos"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}    
                        />
                    <input 
                        placeholder="Address..." 
                        type="address" 
                        className="px-4 py-2 border-2 rounded-md border-n-100 text-n-100 font-Genos"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}  
                        />
                    <div className="flex items-center justify-between gap-x-4">
                        <label className="text-xl text-center font-Genos text-n-100">
                            <input
                            className="rounded-full appearance-none cursor-pointer size-4 bg-n-50 checked:bg-n-100"
                            type="radio"
                            name="payment"
                            value="COD"
                            checked={method === "COD"}
                            onChange={(e) => setMethod(e.target.value)}
                            />
                            COD
                        </label>

                        <label className="text-xl font-Genos text-n-100">
                            <input
                            className="rounded-full appearance-none cursor-pointer size-4 bg-n-50 checked:bg-n-100"
                            type="radio"
                            name="payment"
                            value="VNPay"
                            checked={method === "VNPay"}
                            onChange={(e) => setMethod(e.target.value)}
                            />
                            VNPay
                        </label>

                        <p className="text-xl font-Genos text-n-100">Selected: {method}</p>

                        <p 
                            className="px-4 py-2 text-xl rounded-md cursor-pointer font-Genos text-n-100 bg-n-50 hover:bg-n-50/70"
                            onClick={onOrder}
                        >Confirm Order</p>
                    </div>
                </div>
                
                <div id="product" className="w-[40%] bg-n-50/80 rounded-md px-4">
                    <h1 className="text-3xl font-medium font-Genos text-n-100">Products</h1>
                    
                    <div>
                        
                        {products.map(product => (
                            <div className="flex items-center justify-around w-full">
                                <img src={product[0].productId.image[0]} className="object-contain w-[20%] h-auto"/>
                                <div className="w-[50%]">
                                    <p className="text-xl font-Genos text-n-100 ">Name: {product[0].productId.product_Name}</p>
                                    <p className="text-xl font-Genos text-n-100 ">Price: {product[0].price}</p>
                                    <p className="text-xl font-Genos text-n-100 ">Size: {product[0].size}</p>
                                    <p className="text-xl font-Genos text-n-100 ">Quantity: {product[0].quantity}</p>
                                </div>
                            </div>
                        ))} 
                        
                    </div>
                    

                </div>
            </div>
        </section>
    </>
    )
}export default Home
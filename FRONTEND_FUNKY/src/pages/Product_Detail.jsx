import Hoodie from "../assets/Hodie/hoodie_1.png"
import LoginModal from "../components/LoginModal";
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
    const [chooseProduct, setChooseProduct] = useState("");
    const [openLogin, setOpenLogin] = useState(false);
    const choose_product_variable = (productVariable_id) => {
        setChooseProduct(productVariable_id);
    }

    const add_to_cart = () => {
        if(!chooseProduct){
            return alert("Hey yo, i can't get your size bro !");
        };
        const quantity = 1;

        Cart_AddTo(chooseProduct, quantity)
        .then((res) => alert("I throw one more items in your cart, bro!"))
        .catch((err) => {
            if(err.response.data.err == "You are not authenticated !"){
                setOpenLogin(true);
            }
            if(err.response.data.err == "Token is not valid"){
                alert("Token expired, please login again !");
                setOpenLogin(true);
            }
            else{
                alert(err.response.data.err);
            }
        });
    };

    
    const loadProduct = async(id) => {
        console.log("come here");

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
    
    if (product.length == 0) return <div>Loading...</div>;
    return(
        <>
            <section id="page-2" className="relative w-full h-screen pt-20 ">
                {openLogin?<LoginModal onClose = {() => setOpenLogin(false)}/>:''}
                <p id="product_name" className="w-full pl-8 pr-8 text-5xl font-medium text-center font-Genos text-n-100">{product[0].productId.product_Name}</p>
                <div className="flex items-center justify-between h-full pl-8 pr-8">
                    <div id="page-count" className="flex flex-col gap-4 w-30">
                        <div className="w-23 h-1.25 rounded-2xl bg-n-50"></div>
                        <div className="w-30 h-1.25 rounded-2xl bg-n-100"></div>
                        <div className="w-23 h-1.25 rounded-2xl bg-n-50"></div>
                        <div className="w-23 h-1.25 rounded-2xl bg-n-50"></div>
                    </div>
                    <img src={product[0].productId.image[0]} className="object-contain w-auto h-full"/>
                    <div id="Buy_NewArrival"  className="flex items-center h-150">
                        
                        <div className="flex flex-col justify-around gap-4 p-4 h-130 w-90 rounded-2xl bg-n-200">
                            <p className="text-3xl font-medium font-Genos text-n-100">COLOR</p>
                            <div className="flex w-full h-[5px] items-center justify-between">
                                <div className="w-[25%] h-full bg-n-50 rounded-2xl"></div>
                                <div className="w-[25%] h-full bg-p-50 rounded-2xl"></div>
                                <div className="w-[25%] h-full bg-n-300 rounded-2xl"></div>
                            </div>

                            <p className="text-3xl font-medium font-Genos text-n-100">SIZE</p>
                            <div className="flex justify-around w-full">{
                                product.map((product_variable) => (
                                    <button  
                                        key={product_variable._id} 
                                        disabled={product_variable.stock == 0}
                                        onClick={ () => choose_product_variable(product_variable._id)}
                                        className= {`text-2xl rounded-full cursor-pointer font-Genos size-16 text-n-100 hover:bg-n-50 border-3 border-n-100 ${product_variable.stock === 0 ? "bg-gray-300 text-gray-500 hover:cursor-not-allowed opacity-50" : "text-n-100 hover:bg-n-50"} ${chooseProduct == product_variable._id ? "bg-n-300" : "text-n-100 hover:bg-n-50"} `}>
                                        {product_variable.size}
                                    </button>
                                ))
                            }
                            </div>

                            <p className="text-3xl font-medium font-Genos text-n-100">MATERIAL</p>
                            <p className="w-full pl-4 font-light text-24 font-Genos text-n-100">{product[0].productId.description}</p>
                            <div className="flex items-center justify-around">
                                <p className="text-6xl font-extrabold font-Genos text-n-100">{product[0].price}$</p>

                                <div className="flex flex-col gap-4 ">
                                    <p 
                                        className="px-4 py-2 text-xl font-light rounded-lg cursor-pointer bg-n-50 font-Genos text-n-100 hover:bg-n-50/80"
                                        onClick={() => add_to_cart()}
                                        >Add To Cart
                                    </p>
                                    <p className="px-4 py-2 text-2xl font-light rounded-lg cursor-pointer font-Genos text-n-100 bg-n-200 hover:bg-n-200/80">Buy Now</p>
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
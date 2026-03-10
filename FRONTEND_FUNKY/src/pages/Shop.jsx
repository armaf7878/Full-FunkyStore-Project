import { useEffect, useState } from "react"
import { Product_ShowAll, Categories_ShowAll } from "../app/api";
import { Link } from "react-router-dom";
function Shop(){
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const load_Products = async(e) =>{
        Product_ShowAll()
        .then((res) => setProducts(res))
        .catch((err) => console.log(err))
    }

    const load_Cate = async(e) =>{
        Categories_ShowAll()
        .then((res) => setCategories(res.data))
        .catch((err) => console.log(err))
    }

    useEffect(() => {
        load_Products();
        load_Cate();
    },[]);
    console.log(categories);
    return(
    <>
        <section className="w-full h-auto pt-20 pl-8 pr-8">
            <div className="flex justify-end w-full">
                <input 
                    className="h-8 p-3 w-80 bg-n-50 rounded-2xl font-Genos" 
                    type="text" 
                    placeholder="Finding Your Nature..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            {/* Categories section */}
            <div id="categories" className="mt-8">
                <div className="flex items-center justify-between">
                    <p className="text-3xl text-left w-50 font-Jaro text-n-100">Categories</p>
                    <div className="w-full h-1 rounded-2xl bg-n-50"></div>
                </div>
                {/* Category elements */}
                <div className="flex items-center justify-around pt-4">
                    {categories.map((category) => (
                        <Link to={`category/${category._id}`} key={category._id}>
                            <div className="text-xl rounded-full border-3 hover:bg-n-200 text-n-100 border-n-100 size-18 font-Genos">
                                <img src="/icon_tee.png" className="object-content"/>
                            </div>
                            <p className="text-2xl text-center font-Genos text-n-100">{category.Cate_Name}</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Product Filter Follow Categories section */}
            <div id="product_categories" className="mt-8">
                {categories.map((category) => (
                    <div>
                        <div className="flex items-center justify-between">
                            <p className="text-3xl text-left w-50 font-Jaro text-n-100">{category.Cate_Name}</p>
                            <div className="w-full h-1 rounded-2xl bg-n-50"></div>
                        </div>
                        {/* Product elements */}
                        <div className="flex items-center justify-around w-full pt-4 h-84 ">{products.filter(product => product.categoryId._id == category._id).slice(0,3).map((product) => (
                            <Link to={`${product._id}`} className="h-full">
                                <img 
                                    key={product._id} 
                                    src={product.image[0]} 
                                    className="object-contain w-auto h-full cursor-pointer hover:-translate-y-1"
                                />
                            </Link>
                            
                        ))}
                            <button
                                className="text-2xl rounded-full cursor-pointer font-Genos text-n-100 size-36 border-3 hover:bg-n-200"
                            >Learn More
                            </button>                    
                        </div>
                    </div>
                ))}
            </div>
        </section>
    </>
    )
}export default Shop
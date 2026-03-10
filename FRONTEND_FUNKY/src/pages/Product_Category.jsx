import { useEffect, useState } from "react"
import { Product_ShowAll, Categories_ShowAll } from "../app/api";
import { Link, useParams } from "react-router-dom";

function Product_Category(){
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const {id} = useParams()
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
    return(
    <>
        <section className="w-full h-auto pt-20 pl-8 pr-8">
            {/* Product Filter Follow Categories section */}
            <div id="product_categories" className="mt-8">
                {categories.filter((cate) => cate._id == id).map((category) => (
                    <div className="flex items-center justify-between">
                        <p className="text-3xl text-left w-50 font-Jaro text-n-100">{category.Cate_Name}</p>
                        <div className="w-full h-1 rounded-2xl bg-n-50"></div>
                    </div>
                ))}
                
                <div className="grid w-full grid-cols-4 gap-6 pt-4">
                    {products
                    .filter(product => product.categoryId._id == id)
                    .map((product) => (
                        <Link key={product._id} to={`${product._id}`} className="flex flex-col items-center h-full">
                            <img
                                src={product.image[0]}
                                className="object-contain w-full cursor-pointer h-60 hover:-translate-y-1"
                            />
                            <p className="text-2xl font-Genos text-n-100">
                                {product.product_Name}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    </>
    )
}export default Product_Category
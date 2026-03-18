import { useEffect, useState } from "react";
import { Admin_GetProductDetail, Admin_UpdateProductVariant, Admin_DeleteProductVariant } from "../../../app/api";
import Button from "../../../components/admin/Button";

function ProductDetailModal({productId,onClose}){

    const [data,setData] = useState(null);
    const [editingVariant, setEditingVariant] = useState(null);
    const [editForm, setEditForm] = useState({});
    const loadProduct = async () =>{
        Admin_GetProductDetail(productId)
        .then((res) => setData(res.data))
        .catch((err) => console.log(err))

    };

    useEffect(()=>{
        loadProduct();
    },[]);

    const handleEdit = (variant) => {

        setEditingVariant(variant._id);

        setEditForm({
            size: variant.size,
            color: variant.color,
            price: variant.price,
            stock: variant.stock
        });

    };

    const handleChange = (e) => {

        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });

    };

    const handleSaveVariant = async (id) => {

        try{

            const res = await Admin_UpdateProductVariant(id, editForm);

            if(res.success){

                alert("Variant updated");

                setEditingVariant(null);

                loadProduct(); // reload data

            }

        }catch(err){

            console.error(err.response);

        }

    };

    const handleDeleteVariant = async (id) => {
        if(window.confirm("Are you sure you want to delete this variant?")) {
            try {
                await Admin_DeleteProductVariant(id);
                alert("Variant deleted!");
                loadProduct();
            } catch (err) {
                alert(err.response?.data?.err || "Delete failed");
            }
        }
    };

    if(!data){
        return(
            <div className="fixed inset-0 flex items-center justify-center bg-black/70">
                <div className="text-n-100 font-Genos">Loading...</div>
            </div>
        )
    }

    const {product,variants} = data;

    return(

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 font-Genos">

            <div className="w-[700px] bg-[#020B0A] border border-n-200 rounded-xl p-8">

                {/* HEADER */}
                <div className="flex justify-between mb-6">

                    <h2 className="text-2xl text-n-100">
                        Product Detail
                    </h2>

                    <button
                        className="text-n-50 hover:text-n-100"
                        onClick={onClose}
                    >
                        Close
                    </button>

                </div>


                {/* PRODUCT INFO */}
                <div className="flex gap-6 mb-8">

                    <img
                        src={product.image[0]}
                        alt=""
                        className="object-cover w-32 h-32 rounded"
                    />

                    <div>

                        <h3 className="text-xl text-n-100">
                            {product.product_Name}
                        </h3>

                        <p className="text-n-50">
                            Category: {product.categoryId?.Cate_Name}
                        </p>

                        <p className="mt-2 text-sm text-n-50">
                            {product.description}
                        </p>

                    </div>

                </div>


                {/* VARIANTS TABLE */}

                <table className="w-full border border-n-200">

                    <thead className="bg-n-200">

                        <tr className="text-left text-n-100">

                            <th className="p-3">Size</th>
                            <th className="p-3">Color</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Action</th>

                        </tr>

                    </thead>

                    <tbody className="divide-y divide-n-200">

                    {variants.map((variant)=>{

                        const isEditing = editingVariant === variant._id;

                        return(

                        <tr
                        key={variant._id}
                        className="transition hover:bg-n-200/20"
                        >

                        <td className="px-4 py-3 text-sm text-n-100">

                        {isEditing ? (

                        <input
                        name="size"
                        value={editForm.size}
                        onChange={handleChange}
                        className="w-full px-2 py-1 text-sm border rounded bg-n-200 border-n-200 text-n-100 focus:outline-none focus:ring-1 focus:ring-n-50"
                        />

                        ) : (

                        <span className="font-medium">{variant.size}</span>

                        )}

                        </td>


                        <td className="px-4 py-3 text-sm text-n-100">

                        {isEditing ? (

                        <input
                        name="color"
                        value={editForm.color}
                        onChange={handleChange}
                        className="w-full px-2 py-1 text-sm border rounded bg-n-200 border-n-200 text-n-100 focus:outline-none focus:ring-1 focus:ring-n-50"
                        />

                        ) : (

                        <span>{variant.color}</span>

                        )}

                        </td>


                        <td className="px-4 py-3 text-sm text-n-100">

                        {isEditing ? (

                        <input
                        name="price"
                        value={editForm.price}
                        onChange={handleChange}
                        className="w-full px-2 py-1 text-sm border rounded bg-n-200 border-n-200 text-n-100 focus:outline-none focus:ring-1 focus:ring-n-50"
                        />

                        ) : (

                        <span>${variant.price}</span>

                        )}

                        </td>


                        <td
                        className={`px-4 py-3 text-sm ${
                        variant.stock < 5 ? "text-red-400 font-semibold" : "text-n-100"
                        }`}
                        >

                        {isEditing ? (

                        <input
                        name="stock"
                        value={editForm.stock}
                        onChange={handleChange}
                        className="w-full px-2 py-1 text-sm border rounded bg-n-200 border-n-200 text-n-100 focus:outline-none focus:ring-1 focus:ring-n-50"
                        />

                        ) : (

                        <span>{variant.stock}</span>

                        )}

                        </td>


                        <td className="px-4 py-3">

                        {isEditing ? (

                        <div className="flex gap-2">

                        <button
                        className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-500"
                        onClick={()=>handleSaveVariant(variant._id)}
                        >
                        Save
                        </button>

                        <button
                        className="px-3 py-1 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-500"
                        onClick={()=>setEditingVariant(null)}
                        >
                        Cancel
                        </button>

                        </div>

                        ) : (

                        <div className="flex gap-2">

                        <button
                        className="px-3 py-1 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-500"
                        onClick={()=>handleEdit(variant)}
                        >
                        Edit
                        </button>

                        <button
                        className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-500"
                        onClick={()=>handleDeleteVariant(variant._id)}
                        >
                        Delete
                        </button>

                        </div>

                        )}

                        </td>

                        </tr>

                        )

                    })}

                    </tbody>
                </table>

            </div>

        </div>

    )
}

export default ProductDetailModal
import { useEffect, useState } from "react";
import { Admin_GetProductDetail, Admin_UpdateProduct } from "../../../app/api";

function EditProductModal({productId,onClose,onUpdated}){

    const [form,setForm] = useState({
        product_Name:"",
        description:"",
        categoryId:""
    });

    const [image,setImage] = useState(null);

    const loadProduct = async ()=>{

        const res = await Admin_GetProductDetail(productId);

        if(res.success){

            const p = res.data.product;

            setForm({
                product_Name:p.product_Name,
                description:p.description,
                categoryId:p.categoryId?._id
            });

        }

    };

    useEffect(()=>{
        loadProduct();
    },[]);


    const handleChange = (e)=>{

        setForm({
            ...form,
            [e.target.name]:e.target.value
        });

    };


    const handleSubmit = async ()=>{

        const formData = new FormData();

        formData.append("product_Name",form.product_Name);
        formData.append("description",form.description);
        formData.append("categoryId",form.categoryId);

        if(image){
            formData.append("image",image);
        }

        const res = await Admin_UpdateProduct(productId,formData);

        if(res.success){

            alert("Product updated");

            onUpdated();
            onClose();

        }else{

            alert("Update failed");

        }

    };


    return(

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 font-Genos">

            <div className="w-[600px] p-8 border rounded-xl border-n-200 bg-[#020B0A]">

                <h2 className="mb-6 text-2xl text-n-100">
                    Edit Product
                </h2>

                <div className="space-y-4">

                    <input
                        name="product_Name"
                        value={form.product_Name}
                        onChange={handleChange}
                        className="w-full p-3 border rounded bg-n-200 border-n-200 text-n-100"
                        placeholder="Product name"
                    />

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full p-3 border rounded bg-n-200 border-n-200 text-n-100"
                        placeholder="Description"
                    />

                    <input
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        className="w-full p-3 border rounded bg-n-200 border-n-200 text-n-100"
                        placeholder="Category ID"
                    />

                    {/* upload image */}

                    <input
                        type="file"
                        onChange={(e)=>setImage(e.target.files[0])}
                        className="w-full text-n-100"
                    />

                </div>

                <div className="flex justify-end gap-4 mt-6">

                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded bg-n-200 text-n-100"
                    >
                        Save
                    </button>

                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-n-50"
                    >
                        Cancel
                    </button>

                </div>

            </div>

        </div>

    )

}

export default EditProductModal;
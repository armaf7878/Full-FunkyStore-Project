import { Admin_AllProducts, Admin_DeleteProduct, Admin_DeleteProductVariant } from "../../app/api";
import { useEffect, useState } from "react";
import ProductDetailModal from "./modal/ProductDetailModal";
import EditProductModal from "./modal/EditProductModal";
import CreateProductModal from "./modal/CreateProductModal";
import { Modal, Button } from "../../components/admin";

function Products (){
    const [products,setProducts] = useState([]);
    const [page,setPage] = useState(1);
    const [search,setSearch] = useState("");
    const [sort,setSort] = useState("");
    const [selectedProduct,setSelectedProduct] = useState(null);
    const [editProduct,setEditProduct] = useState(null);
    const [createProduct,setCreateProduct] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteType, setDeleteType] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const loadProducts = () =>{
        const query = `?page=${page}&search=${search}&sort=${sort}`;
        Admin_AllProducts(query).
        then((res) => setProducts(res.data))
        .catch((err) => console.log(err.response))
    }

    const handleDeleteProduct = (productId) => {
        setDeleteType('product');
        setDeleteId(productId);
        setShowDeleteConfirm(true);
    };

    const handleDeleteVariant = (variantId) => {
        setDeleteType('variant');
        setDeleteId(variantId);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            if (deleteType === 'product') {
                await Admin_DeleteProduct(deleteId);
                alert("Product deleted successfully!");
            } else {
                await Admin_DeleteProductVariant(deleteId);
                alert("Variant deleted successfully!");
            }
            setShowDeleteConfirm(false);
            loadProducts();
        } catch (err) {
            alert(err.response?.data?.error || err.response?.data?.message || "Delete failed");
        }
    };

    useEffect(() => {
        loadProducts();
    },[page, search, sort])
    return(
        <section className="min-h-screen p-8 bg-[#020B0A] font-Genos pt-20">
            <h1 className="mb-6 text-3xl text-center text-n-100">
                Product Management
            </h1>

            <div className="flex gap-4 mb-8">

                <input
                    type="text"
                    placeholder="Search product..."
                    className="px-4 py-2 border rounded-lg bg-n-200 border-n-200 text-n-100"
                    onChange={(e)=>setSearch(e.target.value)}
                />

                <select
                    className="px-4 py-2 border rounded-lg bg-n-200 border-n-200 text-n-100"
                    onChange={(e)=>setSort(e.target.value)}
                >
                    <option value="">Sort</option>
                    <option value="name_asc">Name ASC</option>
                    <option value="name_desc">Name DESC</option>
                </select>

                <button
                    className="px-4 py-2 border rounded-lg cursor-pointer bg-n-200 border-n-200 text-n-100"
                    onClick={() =>setCreateProduct(true)}
                >
                    Create Product
                </button>
            </div>


            <div className="overflow-hidden border rounded-xl border-n-200">

                <table className="w-full">

                    <thead className="bg-n-200">

                        <tr className="text-left text-n-100">

                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Variants</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Action</th>

                        </tr>

                    </thead>


                    <tbody>

                        {products.map((item)=>(
                            <tr
                                key={item._id}
                                className="border-t border-n-200 hover:bg-n-200"
                            >

                                <td className="p-4">
                                    <img
                                        src={item.image[0]}
                                        alt=""
                                        className="object-cover w-12 h-12 rounded"
                                    />
                                </td>

                                <td className="p-4 text-n-100">
                                    {item.product_Name}
                                </td>

                                <td className="p-4 text-n-50">
                                    {item.categoryId?.Cate_Name}
                                </td>

                                <td className="p-4 text-n-50">
                                    {item.variantCount}
                                </td>

                                <td className="p-4 text-n-50">
                                    {item.totalStock}
                                </td>

                                <td className="p-4 text-n-50">
                                    {item.priceRange}
                                </td>

                                <td className="p-4">

                                    <button
                                        className="px-3 py-1 mr-2 text-sm rounded bg-n-200 text-n-100"
                                        onClick={()=>setSelectedProduct(item._id)}
                                    >
                                        View
                                    </button>

                                    <button
                                        className="px-3 py-1 mr-2 text-sm rounded bg-n-200 text-n-100"
                                        onClick={()=>setEditProduct(item._id)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="px-3 py-1 text-sm rounded bg-red-600 text-white"
                                        onClick={()=>handleDeleteProduct(item._id)}
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

            <div className="flex justify-center gap-4 mt-8">

                <button
                    className="px-4 py-2 rounded bg-n-200 text-n-100"
                    onClick={()=>setPage(page-1)}
                    disabled={page===1}
                >
                    Prev
                </button>

                <span className="flex items-center text-n-100">
                    Page {page}
                </span>

                <button
                    className="px-4 py-2 rounded bg-n-200 text-n-100"
                    onClick={()=>setPage(page+1)}
                >
                    Next
                </button>

            </div>
                        
            {selectedProduct && (
                <ProductDetailModal
                    productId={selectedProduct}
                    onClose={()=>setSelectedProduct(null)}
                />
            )}

            {editProduct && (
                <EditProductModal
                    productId={editProduct}
                    onClose={()=>setEditProduct(null)}
                    onUpdated={loadProducts}
                />
            )}

            {createProduct && (
                <CreateProductModal
                    onClose={()=>setCreateProduct(null)}
                />
            )}

            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Confirm Delete"
                size="sm"
            >
                <p className="text-n-100 mb-6">
                    Are you sure you want to delete this {deleteType === 'product' ? 'product' : 'variant'}? 
                    This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </div>
            </Modal>
        </section>

    )
    

};
export default Products;
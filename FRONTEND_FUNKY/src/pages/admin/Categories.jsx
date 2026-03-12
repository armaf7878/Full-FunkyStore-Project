import { useEffect, useState } from "react";
import { Admin_GetAllCategories, Admin_CreateCategory, Admin_UpdateCategory, Admin_DeleteCategory } from "../../app/api";
import { Modal, Button, Input, Table, Badge } from "../../components/admin";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("create");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);

    const [formData, setFormData] = useState({
        Cate_Name: "",
        description: ""
    });

    const loadCategories = () => {
        setLoading(true);
        Admin_GetAllCategories()
            .then((res) => {
                setCategories(res.data || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.response?.data?.error || "Failed to load categories");
                setLoading(false);
            });
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleOpenCreate = () => {
        setModalType("create");
        setFormData({
            Cate_Name: "",
            description: ""
        });
        setShowModal(true);
    };

    const handleOpenEdit = (category) => {
        setModalType("edit");
        setSelectedCategory(category);
        setFormData({
            Cate_Name: category.Cate_Name || "",
            description: category.description || ""
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === "create") {
                await Admin_CreateCategory(formData);
                alert("Category created successfully!");
            } else {
                await Admin_UpdateCategory(selectedCategory._id, formData);
                alert("Category updated successfully!");
            }
            setShowModal(false);
            loadCategories();
        } catch (err) {
            alert(err.response?.data?.error || err.response?.data?.message || "Operation failed");
        }
    };

    const handleDeleteClick = (categoryId) => {
        setDeleteCategoryId(categoryId);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await Admin_DeleteCategory(deleteCategoryId);
            alert("Category deleted successfully!");
            setShowDeleteConfirm(false);
            loadCategories();
        } catch (err) {
            alert(err.response?.data?.error || err.response?.data?.message || "Delete failed");
        }
    };

    const columns = [
        {
            header: "Category Name",
            accessor: "Cate_Name",
            render: (row) => <span className="font-medium">{row.Cate_Name}</span>
        },
        {
            header: "Description",
            accessor: "description",
            render: (row) => <span className="text-n-50">{row.description || "-"}</span>
        },
        {
            header: "Products",
            render: (row) => (
                <Badge variant="info">{row.products?.length || 0}</Badge>
            )
        },
        {
            header: "Created At",
            render: (row) => (
                <span className="text-n-50">
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}
                </span>
            )
        },
        {
            header: "Actions",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenEdit(row); }}>
                        Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteClick(row._id); }}>
                        Delete
                    </Button>
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen pt-20">
                <div className="text-n-100 font-Genos text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <section className="w-full min-h-screen pt-20 px-8 pb-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-semibold text-n-100 font-Genos">Categories Management</h1>
                <Button onClick={handleOpenCreate}>+ Create Category</Button>
            </div>

            <div className="bg-[#020B0A] border border-n-200 rounded-xl overflow-hidden">
                <Table 
                    columns={columns} 
                    data={categories}
                    emptyMessage="No categories found"
                />
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={modalType === "create" ? "Create Category" : "Edit Category"}
                size="md"
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Category Name"
                        value={formData.Cate_Name}
                        onChange={(e) => setFormData({ ...formData, Cate_Name: e.target.value })}
                        placeholder="Enter category name"
                        required
                    />
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-n-50 font-Genos">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter description"
                            rows={3}
                            className="w-full px-4 py-2.5 bg-[#020B0A] border border-n-200 rounded-lg text-n-100 font-Genos placeholder:text-n-50/50 focus:outline-none focus:border-p-50 transition-colors resize-none"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit">{modalType === "create" ? "Create" : "Save Changes"}</Button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Confirm Delete"
                size="sm"
            >
                <p className="text-n-100 mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
                </div>
            </Modal>
        </section>
    );
}

export default Categories;

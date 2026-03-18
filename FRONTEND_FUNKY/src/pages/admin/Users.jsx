import { useEffect, useState } from "react";
import { Admin_GetAllUsers, Admin_CreateStaff, Admin_UpdateUser, Admin_DeleteUser, Admin_GetUserDetail } from "../../app/api";
import { Modal, Button, Input, Select, Table, Badge } from "../../components/admin";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("create");
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetail, setUserDetail] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null);

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        role: "end_user"
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const loadUsers = () => {
        setLoading(true);
        Admin_GetAllUsers()
            .then((res) => {
                setUsers(res.data || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.response?.data?.error || "Failed to load users");
                setLoading(false);
            });
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleOpenCreate = () => {
        setModalType("create");
        setFormData({
            fullname: "",
            email: "",
            password: "",
            phone: "",
            address: "",
            role: "staff"
        });
        setShowModal(true);
    };

    const handleOpenEdit = (user) => {
        setModalType("edit");
        setSelectedUser(user);
        setFormData({
            fullname: user.fullname || "",
            email: user.email || "",
            password: "",
            phone: user.phone || "",
            address: user.address || "",
            role: user.role || "end_user"
        });
        setShowModal(true);
    };

    const handleViewDetail = async (user) => {
        try {
            const res = await Admin_GetUserDetail(user._id);
            setUserDetail(res.data);
            setSelectedUser(user);
            setShowDetailModal(true);
        } catch (err) {
            alert("Failed to load user details");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === "create") {
                await Admin_CreateStaff(formData);
                alert("Staff created successfully!");
            } else {
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password;
                await Admin_UpdateUser(selectedUser._id, updateData);
                alert("User updated successfully!");
            }
            setShowModal(false);
            loadUsers();
        } catch (err) {
            alert(err.response?.data?.error || err.response?.data?.message || "Operation failed");
        }
    };

    const handleDeleteClick = (userId) => {
        setDeleteUserId(userId);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await Admin_DeleteUser(deleteUserId);
            alert("User deleted successfully!");
            setShowDeleteConfirm(false);
            loadUsers();
        } catch (err) {
            alert(err.response?.data?.error || err.response?.data?.message || "Delete failed");
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.includes(searchTerm);
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role) => {
        const variants = {
            admin: "danger",
            staff: "info",
            end_user: "default"
        };
        const labels = {
            admin: "Admin",
            staff: "Staff",
            end_user: "User"
        };
        return <Badge variant={variants[role]}>{labels[role]}</Badge>;
    };

    const columns = [
        {
            header: "User",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <img 
                        src={row.image || "https://vn.freepik.com/bieu-tuong/boy-avatar_12965382"} 
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-medium">{row.fullname}</p>
                        <p className="text-xs text-n-50">{row.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Phone",
            accessor: "phone"
        },
        {
            header: "Role",
            render: (row) => getRoleBadge(row.role)
        },
        {
            header: "Created At",
            render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"
        },
        {
            header: "Actions",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleViewDetail(row); }}>
                        View
                    </Button>
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
                <h1 className="text-4xl font-semibold text-n-100 font-Genos">Users Management</h1>
                <Button onClick={handleOpenCreate}>+ Create Staff</Button>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 max-w-md">
                    <Input
                        placeholder="Search by name, email or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    options={[
                        { value: "all", label: "All Roles" },
                        { value: "admin", label: "Admin" },
                        { value: "staff", label: "Staff" },
                        { value: "end_user", label: "User" }
                    ]}
                    className="w-48"
                />
            </div>

            <div className="bg-[#020B0A] border border-n-200 rounded-xl overflow-hidden">
                <Table 
                    columns={columns} 
                    data={filteredUsers}
                    onRowClick={handleViewDetail}
                />
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={modalType === "create" ? "Create Staff Account" : "Edit User"}
                size="md"
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Full Name"
                        value={formData.fullname}
                        onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                        placeholder="Enter full name"
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter email"
                        required
                    />
                    {modalType === "create" && (
                        <Input
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Enter password"
                            required
                        />
                    )}
                    <Input
                        label="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Enter phone number"
                        required
                    />
                    <Input
                        label="Address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Enter address"
                    />
                    <Select
                        label="Role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        options={[
                            { value: "staff", label: "Staff" },
                            { value: "end_user", label: "User" }
                        ]}
                    />
                    <div className="flex justify-end gap-3 mt-4">
                        <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit">{modalType === "create" ? "Create" : "Save Changes"}</Button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title="User Details"
                size="md"
            >
                {userDetail && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <img 
                                src={userDetail.image || "https://vn.freepik.com/bieu-tuong/boy-avatar_12965382"} 
                                alt="avatar"
                                className="w-20 h-20 rounded-full object-cover"
                            />
                            <div>
                                <h3 className="text-2xl font-semibold text-n-100">{userDetail.fullname}</h3>
                                <p className="text-n-50">{userDetail.email}</p>
                                {getRoleBadge(userDetail.role)}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 p-4 bg-n-200/20 rounded-lg">
                            <div>
                                <p className="text-sm text-n-50">Phone</p>
                                <p className="text-n-100">{userDetail.phone || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-n-50">Address</p>
                                <p className="text-n-100">{userDetail.address || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-n-50">Created At</p>
                                <p className="text-n-100">{new Date(userDetail.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-n-50">Total Orders</p>
                                <p className="text-n-100">{userDetail.orders?.length || 0}</p>
                            </div>
                        </div>
                        {userDetail.orders && userDetail.orders.length > 0 && (
                            <div>
                                <h4 className="text-lg font-semibold text-n-100 mb-2">Recent Orders</h4>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {userDetail.orders.slice(0, 5).map((order) => (
                                        <div key={order._id} className="flex justify-between p-2 bg-n-200/10 rounded">
                                            <span className="text-n-100">#{order._id.slice(-6)}</span>
                                            <span className="text-n-50">${order.total_amount}</span>
                                            <Badge variant={order.status === 'done' ? 'success' : 'warning'}>{order.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Confirm Delete"
                size="sm"
            >
                <p className="text-n-100 mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
                </div>
            </Modal>
        </section>
    );
}

export default Users;

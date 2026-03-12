import { useEffect, useState } from "react";
import { Admin_GetAllOrders, Admin_GetOrderDetail, Admin_UpdateOrderStatus, Admin_UpdatePaymentStatus, Admin_DeleteOrder } from "../../app/api";
import { Modal, Button, Input, Select, Table, Badge } from "../../components/admin";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetail, setOrderDetail] = useState(null);
    const [deleteOrderId, setDeleteOrderId] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [updatingPayment, setUpdatingPayment] = useState(false);

    const [statusFilter, setStatusFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const loadOrders = () => {
        setLoading(true);
        Admin_GetAllOrders()
            .then((res) => {
                setOrders(res.data || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.response?.data?.error || "Failed to load orders");
                setLoading(false);
            });
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleViewDetail = async (order) => {
        try {
            const res = await Admin_GetOrderDetail(order._id);
            setOrderDetail(res.data);
            setSelectedOrder(order);
            setShowDetailModal(true);
        } catch (err) {
            alert("Failed to load order details");
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        setUpdatingStatus(true);
        try {
            await Admin_UpdateOrderStatus(orderId, newStatus);
            alert("Order status updated!");
            loadOrders();
            if (selectedOrder?._id === orderId) {
                handleViewDetail({ _id: orderId });
            }
        } catch (err) {
            alert(err.response?.data?.error || err.response?.data?.message || "Update failed");
        }
        setUpdatingStatus(false);
    };

    const handleUpdatePayment = async (orderId, newStatus) => {
        setUpdatingPayment(true);
        try {
            await Admin_UpdatePaymentStatus(orderId, newStatus);
            alert("Payment status updated!");
            loadOrders();
            if (selectedOrder?._id === orderId) {
                handleViewDetail({ _id: orderId });
            }
        } catch (err) {
            alert(err.response?.data?.error || err.response?.data?.message || "Update failed");
        }
        setUpdatingPayment(false);
    };

    const handleDeleteClick = (orderId) => {
        setDeleteOrderId(orderId);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await Admin_DeleteOrder(deleteOrderId);
            alert("Order deleted successfully!");
            setShowDeleteConfirm(false);
            loadOrders();
        } catch (err) {
            alert(err.response?.data?.error || err.response?.data?.message || "Delete failed");
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user_id?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.order_phone?.includes(searchTerm);
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        const matchesPayment = paymentFilter === "all" || order.payment_status === paymentFilter;
        return matchesSearch && matchesStatus && matchesPayment;
    });

    const getStatusBadge = (status) => {
        const variants = {
            pending: "warning",
            confirmed: "info",
            delivering: "purple",
            done: "success",
            refund: "danger"
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    const getPaymentBadge = (status) => {
        const variants = {
            waiting_payment: "warning",
            paid: "success",
            canceled: "danger"
        };
        return <Badge variant={variants[status]}>{status.replace('_', ' ')}</Badge>;
    };

    const columns = [
        {
            header: "Order ID",
            render: (row) => <span className="text-n-50">#{row._id?.slice(-6)}</span>
        },
        {
            header: "Customer",
            render: (row) => (
                <div>
                    <p className="font-medium">{row.user_id?.fullname || "Unknown"}</p>
                    <p className="text-xs text-n-50">{row.user_id?.email || "-"}</p>
                </div>
            )
        },
        {
            header: "Total",
            render: (row) => <span className="font-medium">${row.total_amount?.toLocaleString()}</span>
        },
        {
            header: "Status",
            render: (row) => getStatusBadge(row.status)
        },
        {
            header: "Payment",
            render: (row) => (
                <div className="flex flex-col gap-1">
                    {getPaymentBadge(row.payment_status)}
                    <span className="text-xs text-n-50">{row.payment_method}</span>
                </div>
            )
        },
        {
            header: "Date",
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
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleViewDetail(row); }}>
                        View
                    </Button>
                    <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteClick(row._id); }}>
                        Delete
                    </Button>
                </div>
            )
        }
    ];

    const statusOptions = [
        { value: "all", label: "All Status" },
        { value: "pending", label: "Pending" },
        { value: "confirmed", label: "Confirmed" },
        { value: "delivering", label: "Delivering" },
        { value: "done", label: "Done" },
        { value: "refund", label: "Refund" }
    ];

    const paymentOptions = [
        { value: "all", label: "All Payment" },
        { value: "waiting_payment", label: "Waiting Payment" },
        { value: "paid", label: "Paid" },
        { value: "canceled", label: "Canceled" }
    ];

    const orderStatusOptions = [
        { value: "pending", label: "Pending" },
        { value: "confirmed", label: "Confirmed" },
        { value: "delivering", label: "Delivering" },
        { value: "done", label: "Done" },
        { value: "refund", label: "Refund" }
    ];

    const paymentStatusOptions = [
        { value: "waiting_payment", label: "Waiting Payment" },
        { value: "paid", label: "Paid" },
        { value: "canceled", label: "Canceled" }
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
                <h1 className="text-4xl font-semibold text-n-100 font-Genos">Orders Management</h1>
                <div className="text-n-50 font-Genos">
                    Total: {filteredOrders.length} orders
                </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 max-w-md">
                    <Input
                        placeholder="Search by order ID, customer name or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    options={statusOptions}
                    className="w-40"
                />
                <Select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    options={paymentOptions}
                    className="w-48"
                />
            </div>

            <div className="bg-[#020B0A] border border-n-200 rounded-xl overflow-hidden">
                <Table 
                    columns={columns} 
                    data={filteredOrders}
                    onRowClick={handleViewDetail}
                />
            </div>

            <Modal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title={`Order #${selectedOrder?._id?.slice(-6)}`}
                size="lg"
            >
                {orderDetail && (
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-n-200/20 rounded-lg">
                                <h4 className="text-sm text-n-50 mb-2">Customer Info</h4>
                                <p className="text-n-100 font-medium">{orderDetail.order.user_id?.fullname}</p>
                                <p className="text-n-50 text-sm">{orderDetail.order.user_id?.email}</p>
                                <p className="text-n-50 text-sm">{orderDetail.order.order_phone}</p>
                                <p className="text-n-50 text-sm">{orderDetail.order.order_address}</p>
                            </div>
                            <div className="p-4 bg-n-200/20 rounded-lg">
                                <h4 className="text-sm text-n-50 mb-2">Order Info</h4>
                                <p className="text-n-100">Total: <span className="font-semibold">${orderDetail.order.total_amount?.toLocaleString()}</span></p>
                                <p className="text-n-50 text-sm">Payment: {orderDetail.order.payment_method}</p>
                                <p className="text-n-50 text-sm">Date: {new Date(orderDetail.order.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-sm text-n-50 mb-2 block">Order Status</label>
                                <Select
                                    value={orderDetail.order.status}
                                    onChange={(e) => handleUpdateStatus(orderDetail.order._id, e.target.value)}
                                    options={orderStatusOptions}
                                    disabled={updatingStatus}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-sm text-n-50 mb-2 block">Payment Status</label>
                                <Select
                                    value={orderDetail.order.payment_status}
                                    onChange={(e) => handleUpdatePayment(orderDetail.order._id, e.target.value)}
                                    options={paymentStatusOptions}
                                    disabled={updatingPayment}
                                />
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-n-100 mb-3">Products</h4>
                            <div className="space-y-2">
                                {orderDetail.items?.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-3 bg-n-200/10 rounded-lg">
                                        <img 
                                            src={item.product_detail_id?.productId?.image?.[0] || "/placeholder.png"} 
                                            alt="product"
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="text-n-100 font-medium">{item.product_detail_id?.productId?.product_Name}</p>
                                            <p className="text-n-50 text-sm">
                                                Size: {item.product_detail_id?.size} | Color: {item.product_detail_id?.color}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-n-100">${item.price}</p>
                                            <p className="text-n-50 text-sm">x{item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Confirm Delete"
                size="sm"
            >
                <p className="text-n-100 mb-6">Are you sure you want to delete this order? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
                </div>
            </Modal>
        </section>
    );
}

export default Orders;

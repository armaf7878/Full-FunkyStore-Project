import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User_GetOrderHistory, User_GetOrderById, VNPay_CreatePayment } from "../app/api";
import Badge from "../components/admin/Badge";

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetail, setOrderDetail] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);

    // Debug: Check token
    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("token");
            console.log("=== FRONTEND DEBUG ===");
            console.log("Token in localStorage:", token ? "EXISTS" : "NULL");
            console.log("Token value:", token ? token.substring(0, 50) + "..." : "NULL");
        };
        
        checkToken();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("=== ON MOUNT DEBUG ===");
        console.log("Token:", token);
    }, []);

    const loadOrders = () => {
        const token = localStorage.getItem("token");
        console.log("=== LOAD ORDERS DEBUG ===");
        console.log("Token before API call:", token);
        
        if (!token) {
            setError("No token found. Please login again.");
            setLoading(false);
            return;
        }
        
        setLoading(true);
        User_GetOrderHistory()
            .then((res) => {
                console.log("Orders response:", res);
                setOrders(res.data?.data || res.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Load orders error:", err);
                setError(err.response?.data?.error || err.response?.data?.err || "Failed to load orders");
                setLoading(false);
            });
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleViewDetail = async (order) => {
        try {
            const res = await User_GetOrderById(order._id);
            setOrderDetail(res.data);
            setSelectedOrder(order);
            setShowDetailModal(true);
        } catch (err) {
            alert("Failed to load order details");
        }
    };

    const handleVNPayPayment = async (order) => {
        setProcessingPayment(true);
        try {
            const orderId = order.order?._id || order._id;
            const res = await VNPay_CreatePayment(order.total_amount || order.order.total_amount, orderId);
            if (res.paymentUrl) {
                window.location.href = res.paymentUrl;
            } else {
                alert("Failed to create payment");
            }
        } catch (err) {
            alert(err.response?.data?.err || "Payment failed");
        }
        setProcessingPayment(false);
    };

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen pt-20">
                <div className="text-n-100 font-Genos text-xl">Loading...</div>
            </div>
        );
    }

    // Debug: Show error if any
    const token = localStorage.getItem("token");
    if (error || !token) {
        return (
            <section className="w-full min-h-screen pt-20 px-8 pb-8 bg-[#020B0A]">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-semibold text-n-100 font-Genos mb-4">Order History</h1>
                    <div className="bg-red-500/20 border border-red-500 rounded-lg p-6">
                        <p className="text-red-500 font-Genos text-xl mb-4">
                            {error || "You are not logged in!"}
                        </p>
                        <p className="text-n-50 mb-4">Token status: {token ? "EXISTS" : "NOT FOUND"}</p>
                        <button 
                            onClick={() => window.location.href = '/'}
                            className="px-6 py-2 bg-p-50 text-[#020B0A] font-Genos rounded-lg"
                        >
                            Go to Home and Login
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full min-h-screen pt-20 px-8 pb-8 bg-[#020B0A]">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-semibold text-n-100 font-Genos">Order History</h1>
                    <Link 
                        to="/"
                        className="text-n-50 hover:text-n-100 font-Genos"
                    >
                        ← Back to Home
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-n-50 font-Genos text-xl mb-4">You haven't placed any orders yet.</p>
                        <Link 
                            to="/shop"
                            className="inline-block px-6 py-3 bg-p-50 text-[#020B0A] font-Genos rounded-lg hover:bg-p-50/80 transition"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div 
                                key={order._id}
                                className="bg-[#020B0A] border border-n-200 rounded-xl p-6 hover:border-n-100 transition cursor-pointer"
                                onClick={() => handleViewDetail(order)}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-n-100 font-Genos">
                                            Order #{order._id?.slice(-6)}
                                        </h3>
                                        <p className="text-sm text-n-50">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-semibold text-n-100">
                                            ${order.total_amount?.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-n-50">{order.payment_method}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {getStatusBadge(order.status)}
                                    {getPaymentBadge(order.payment_status)}
                                    {order.payment_status === 'waiting_payment' && order.payment_method === 'VNPay' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleVNPayPayment(order); }}
                                            disabled={processingPayment}
                                            className="px-4 py-1.5 bg-p-50 text-[#020B0A] font-Genos text-sm rounded-lg hover:bg-p-50/80 transition disabled:opacity-50"
                                        >
                                            {processingPayment ? "Processing..." : "Pay Now"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showDetailModal && orderDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div 
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowDetailModal(false)}
                    />
                    <div className="relative w-full max-w-2xl mx-4 bg-[#020B0A] border border-n-200 rounded-xl shadow-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-n-200">
                            <h2 className="text-2xl font-semibold text-n-100 font-Genos">
                                Order #{selectedOrder._id?.slice(-6)}
                            </h2>
                            <button 
                                onClick={() => setShowDetailModal(false)}
                                className="p-2 text-n-50 hover:text-n-100 transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-n-200/20 rounded-lg">
                                    <h4 className="text-sm text-n-50 mb-2">Shipping Address</h4>
                                    <p className="text-n-100">{orderDetail.order.order_address}</p>
                                    <p className="text-n-50 text-sm">{orderDetail.order.order_phone}</p>
                                </div>
                                <div className="p-4 bg-n-200/20 rounded-lg">
                                    <h4 className="text-sm text-n-50 mb-2">Payment</h4>
                                    <p className="text-n-100">{orderDetail.order.payment_method}</p>
                                    <div className="mt-2">{getPaymentBadge(orderDetail.order.payment_status)}</div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-lg font-semibold text-n-100 mb-3">Order Status</h4>
                                {getStatusBadge(orderDetail.order.status)}
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-n-100 mb-3">Products</h4>
                                <div className="space-y-3">
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

                            <div className="mt-6 pt-4 border-t border-n-200">
                                <div className="flex justify-between text-lg">
                                    <span className="text-n-50">Total</span>
                                    <span className="text-n-100 font-semibold">${orderDetail.order.total_amount?.toLocaleString()}</span>
                                </div>
                            </div>

                            {orderDetail.order.payment_status === 'waiting_payment' && orderDetail.order.payment_method === 'VNPay' && (
                                <div className="mt-4">
                                    <button
                                        onClick={() => handleVNPayPayment(orderDetail)}
                                        disabled={processingPayment}
                                        className="w-full py-3 bg-p-50 text-[#020B0A] font-Genos rounded-lg hover:bg-p-50/80 transition disabled:opacity-50"
                                    >
                                        {processingPayment ? "Processing..." : "Pay with VNPay"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default OrderHistory;

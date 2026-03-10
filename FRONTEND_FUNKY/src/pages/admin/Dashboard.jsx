import { useEffect } from "react";
import{Admin_Dashboard} from "../../app/api";
import { useState } from "react";
import Card from "../../components/Card";
import LoginModal from "../../components/LoginModal";
function Dashboard(){
    const [dashboard, setDashboard] = useState(null);
    const [openLogin, setOpenLogin] = useState(false);
    const loadAPI = () => {
        Admin_Dashboard()
        .then((res) => setDashboard(res.data))
        .catch((err) => {
            if(err.response.data.err == "You are not admin !"){
                alert("You are not admin !");
            }
            if(err.response.data.err == "Token is not valid"){
                alert("Token is not valid");
            }
            if(err.response.data.err == "You are not authenticated !"){
                alert("You are not authenticated !");
                setOpenLogin(true);
            }
            else{
                alert("Something go wrong")
                console.log(err.response.data.err)
            }
        })
    };

    useEffect(() => {
        loadAPI();
    },[openLogin]);
    
    if(!dashboard){
        if(openLogin){
            
        }
        return(
            <div className="flex items-center relative justify-center h-screen bg-[#020B0A] text-n-100 font-Genos">
                {openLogin?<LoginModal onClose = {() => setOpenLogin(false)}/>:''}
                Loading Dashboard...
            </div>
        )
    }
    const overview = dashboard.overview;
    
    
    return(
        <section id="dashboard" className="relative w-full h-screen">
            
            <div className="w-full h-full pt-20 pl-8 pr-8">
                <h1 className="w-full mb-10 text-4xl text-center font-Genos text-n-100">
                    Admin Dashboard
                </h1>

                <div className="grid grid-cols-4 gap-6 mb-12">

                    <Card title="Total Users" value={overview.totalUsers}/>
                    <Card title="Total Products" value={overview.totalProducts}/>
                    <Card title="Total Orders" value={overview.totalOrders}/>
                    <Card title="Categories" value={overview.totalCategories}/>
                    <Card title="Revenue" value={`$${overview.totalRevenue}`}/>
                    <Card title="Pending Orders" value={overview.pendingOrders}/>
                    <Card title="Low Stock Products" value={overview.lowStockProducts}/>

                </div>

                <div className="p-6 border rounded-xl border-n-200 bg-[#020B0A]">

                    <h2 className="mb-6 text-2xl text-n-100">
                        Top Selling Products
                    </h2>

                    <div className="space-y-4">
                        {dashboard.topProducts.map((item)=>(
                            <div
                                key={item._id}
                                className="flex items-center justify-between p-4 border rounded-lg border-n-200 bg-n-200"
                            >
                                {/* product info */}
                                <div className="flex items-center gap-4">

                                    <img
                                        src={item.product.image[0]}
                                        alt=""
                                        className="object-cover w-16 h-16 rounded"
                                    />

                                    <div>

                                        <h3 className="text-lg text-n-100">
                                            {item.product.product_Name}
                                        </h3>

                                        <p className="text-sm text-n-50">
                                            Size: {item.productDetail.size} | Color: {item.productDetail.color}
                                        </p>

                                    </div>

                                </div>
                                {/* stats */}
                                <div className="text-right">

                                    <p className="text-n-100">
                                        Sold: {item.totalSold}
                                    </p>

                                    <p className="text-n-50">
                                        Revenue: ${item.totalRevenue}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
};
export default Dashboard;
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Collection from "../pages/Collection";
import Order from "../pages/Order";
import Product_Detail from "../pages/Product_Detail";
import Cart from "../pages/Cart";
import Product_Category from "../pages/Product_Category";
// --------------------------
import Admin from "../Admin";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products.";
import Users from "../pages/admin/Users";
import Orders from "../pages/admin/Orders";
import Reports from "../pages/admin/Reports";
export const router = createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children:[
            {index: true, element:<Home/>},
            {path: "shop", element:<Shop/>},
            {path: "shop/:id", element:<Product_Detail/>},
            {path: "shop/category/:id", element:<Product_Category/>},
            {path: "collection", element:<Collection/>},
            {path:"order", element:<Order/>},
            {path:"cart", element:<Cart/>},
            
        ]
    },

    {
        path:'/admin',
        element: <Admin/>,
        children:[
            {index: true, element:<Dashboard/>},
            {path:"users", element:<Users/>},
            {path:"orders", element:<Orders/>},
            {path:"products", element:<Products/>},
            {path:"reports", element:<Reports/>},
        ]
    }
])
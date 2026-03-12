import axios from "axios";
import axiosClient from "./axiosClient";
const BASE_URL = import.meta.env.VITE_API_URL;
const PRODUCT_API = `${BASE_URL}/product`;
const CATEGORIES_API = `${BASE_URL}/category`;
const CART = `${BASE_URL}/cart`;
const ACCOUNT = `${BASE_URL}/user`;
const ORDER = `${BASE_URL}/order`;
const ADMIN = `${BASE_URL}/admin`;
const Account_Login = async(email, password) => {
    return axios.post(`${ACCOUNT}/login`, {email, password})
    .then((res) => res.data)
    .catch((err) => {throw err});
}; export {Account_Login}


const Product_ShowAll = async() =>{
    return axios.get(`${PRODUCT_API}/showall`)
    .then((res) => res.data)
    .catch((err) => {throw err})
}; export {Product_ShowAll}

const Product_GetProduct = async(id_product) =>{
    return axios.get(`${PRODUCT_API}/${id_product}`)
    .then((res) => res.data)
    .catch((err) => {throw err})
}; export {Product_GetProduct}

const Product_ShowAllVariable = async() =>{
    return axios.get(`${PRODUCT_API}/showall_variable`)
    .then((res) => res.data)
    .catch((err) => {throw err})
}; export {Product_ShowAllVariable}

const Product_Get1Variable = async(variableProduct_id) =>{
    return axios.get(`${PRODUCT_API}/variable/${variableProduct_id}`)
    .then((res) => res.data)
    .catch((err) => {throw err})
}; export {Product_Get1Variable}

const Categories_ShowAll = async() =>{
    return axios.get(`${CATEGORIES_API}/showall`)
    .then((res) => res.data)
    .catch((err) => {throw err})
}; export {Categories_ShowAll}

const Cart_AddTo = async(product_variable, quantity) => {
    return axiosClient.post(`${CART}/add-to-cart`, {product_variable, quantity})
    .then((res) => res.data)
    .catch((err) => {throw err})
}; export {Cart_AddTo}

const Cart_GetCart = async() => {
    return axiosClient.get(`${CART}/get-cart`)
    .then((res) => res.data)
    .catch((err) => {throw err})
}; export {Cart_GetCart}

const Cart_Delete = async(cart_id) => {
    return axiosClient.delete(`${CART}/delete`, {data: { cart_id }})
    .then((res) => res.data)
    .catch((err) => {throw err})
}; export {Cart_Delete}

const Order_Create = async(order_address, payment_method, order_phone, products) => {
    return axiosClient.post(`${ORDER}/create`, {order_address, payment_method, order_phone, products})
    .then((res) => res.data)
    .catch((err) => {throw err})
}; export {Order_Create}

const Admin_Dashboard = async() => {
    return axiosClient.get(`${ADMIN}/dashboard`)
    .then((res) => res.data)
    .catch((err)  =>  {throw err});
}; export {Admin_Dashboard}

const Admin_AllProducts = async(params = "") => {
    return axiosClient.get(`${ADMIN}/products${params}`)
    .then((res) => res.data)
    .catch((err)  =>  {throw err});
}; export {Admin_AllProducts }

const Admin_GetProductDetail  = async(id) => {
    return axiosClient.get(`${ADMIN}/products/${id}`)
    .then((res) => res.data)
    .catch((err)  =>  {throw err});
}; export {Admin_GetProductDetail }

const Admin_ProductCreate = async(data) =>{
    return axios.post(`${PRODUCT_API}/create`, data, {headers:{"Content-Type":"multipart/form-data"}})
    .then((res) => res.data)
    .catch((err) => {throw err})
}; export {Admin_ProductCreate}


const Admin_UpdateProduct  = async(id, data) => {
    return axiosClient.put(`${ADMIN}/products/${id}`, data, {headers:{"Content-Type":"multipart/form-data"}})
    .then((res) => res.data)
    .catch((err)  =>  {throw err});
}; export {Admin_UpdateProduct }

const Admin_UpdateProductVariant = async (id, data) => {
    return axiosClient.put(`${ADMIN}/product-variants/${id}`, data)
        .then(res => res.data)
        .catch(err => { throw err });
}; export { Admin_UpdateProductVariant };

const Admin_DeleteProduct = async (id) => {
    return axiosClient.delete(`${ADMIN}/products/${id}`)
        .then(res => res.data)
        .catch(err => { throw err });
}; export { Admin_DeleteProduct };

const Admin_DeleteProductVariant = async (id) => {
    return axiosClient.delete(`${ADMIN}/product-variants/${id}`)
        .then(res => res.data)
        .catch(err => { throw err });
}; export { Admin_DeleteProductVariant };

const Admin_GetAllUsers = async () => {
    return axiosClient.get(`${ADMIN}/users`)
        .then(res => res.data)
        .catch(err => { throw err });
}; export { Admin_GetAllUsers };

const Admin_GetUserDetail = async (id) => {
    return axiosClient.get(`${ADMIN}/users/${id}`)
        .then(res => res.data)
        .catch(err => { throw err });
}; export { Admin_GetUserDetail };

const Admin_CreateStaff = async (data) => {
    return axiosClient.post(`${ADMIN}/users/create-staff`, data)
        .then(res => res.data)
        .catch(err => { throw err });
}; export { Admin_CreateStaff };

const Admin_UpdateUser = async (id, data) => {
    return axiosClient.put(`${ADMIN}/users/${id}`, data)
        .then(res => res.data)
        .catch(err => { throw err });
}; export { Admin_UpdateUser };

const Admin_DeleteUser = async (id) => {
    return axiosClient.delete(`${ADMIN}/users/${id}`)
        .then(res => res.data)
        .catch(err => { throw err });
}; export { Admin_DeleteUser };

const Admin_GetAllOrders = async (params = "") => {
    return axiosClient.get(`${ADMIN}/orders${params}`)
        .then(res => res.data)
        .catch(err => { throw err });
}; export { Admin_GetAllOrders };

const Admin_GetOrderDetail = async (id) => {
    return axiosClient.get(`${ADMIN}/orders/${id}`)
        .then(res => res.data)
        .catch(err => { throw err });
}; export { Admin_GetOrderDetail };

const Admin_UpdateOrderStatus = async (id, status) => {
    return axiosClient.put(`${ADMIN}/orders/${id}/status`, { status })
        .then(res => res.data)
        .catch(err => { throw err });
}; export { Admin_UpdateOrderStatus };

const Admin_UpdatePaymentStatus = async (id, payment_status) => {
    return axiosClient.put(`${ADMIN}/orders/${id}/payment-status`, { payment_status })
        .then(res => res.data)
        .catch(err => { throw err });
}; export { Admin_UpdatePaymentStatus };

const Admin_DeleteOrder = async (id) => {
    return axiosClient.delete(`${ADMIN}/orders/${id}`)
        .then(res => res.data)
        .catch(err => { throw err });
}; export { Admin_DeleteOrder };

const Admin_GetAllCategories = async () => {
    return axiosClient.get(`${ADMIN}/categories`)
        .then(res => res.data)
        .catch(err => { throw err });
}; export { Admin_GetAllCategories };

const Admin_CreateCategory = async (data) => {
    return axiosClient.post(`${ADMIN}/categories`, data)
        .then(res => res.data)
        .catch(err => { throw err });
}; export { Admin_CreateCategory };

const Admin_UpdateCategory = async (id, data) => {
    return axiosClient.put(`${ADMIN}/categories/${id}`, data)
        .then(res => res.data)
        .catch(err => { throw err });
}; export { Admin_UpdateCategory };

const Admin_DeleteCategory = async (id) => {
    return axiosClient.delete(`${ADMIN}/categories/${id}`)
        .then(res => res.data)
        .catch(err => { throw err });
}; export { Admin_DeleteCategory };

const User_GetOrderHistory = async () => {
    return axiosClient.get(`${ORDER}/user/orders`)
        .then(res => res.data)
        .catch(err => { throw err });
}; export { User_GetOrderHistory };

const User_GetOrderById = async (id) => {
    return axiosClient.get(`${ORDER}/user/${id}`)
        .then(res => res.data)
        .catch(err => { throw err });
}; export { User_GetOrderById };

const VNPay_CreatePayment = async (amount, orderId) => {
    return axiosClient.post(`${ORDER}/vnpay/create`, { amount, orderId })
        .then(res => res.data)
        .catch(err => { throw err });
}; export { VNPay_CreatePayment };

const VNPay_Callback = async (params) => {
    return axiosClient.get(`${ORDER}/vnpay/callback`, { params })
        .then(res => res.data)
        .catch(err => { throw err });
}; export { VNPay_Callback };
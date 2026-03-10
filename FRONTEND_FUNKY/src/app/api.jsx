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


const Product_ShowAll = async(e) =>{
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

const Categories_ShowAll = async(e) =>{
    return axios.get(`${CATEGORIES_API}/showall`)
    .then((res) => res.data)
    .catch((err) => {throw err})
}; export {Categories_ShowAll}

const Cart_AddTo = async(product_variable, quantity) => {
    return axiosClient.post(`${CART}/add-to-cart`, {product_variable, quantity})
    .then((res) => res.data)
    .catch((err) => {throw err})
}; export {Cart_AddTo}

const Cart_GetCart = async(e) => {
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

const Admin_Dashboard = async(e) => {
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
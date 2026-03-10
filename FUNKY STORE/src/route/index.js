const UserRoute = require('./UserRoute');
const CateRoute = require('./CategoryRoute');
const ProductRoute = require('./ProductRout');
const OrderRoute = require('./OrderRoute');
const CartRoute = require('./CartRoute');
const AdminRoute = require('./AdminRoute');
function route(app){
    app.use('/api/user', UserRoute);
    app.use('/api/category', CateRoute);
    app.use('/api/product', ProductRoute);
    app.use('/api/order', OrderRoute);
    app.use('/api/cart', CartRoute);
    app.use('/api/admin', AdminRoute);
}

module.exports = route;
        const express = require('express');
        const router = express.Router();
        const { placeOrder, 
                getMyOrders, 
                getAllOrders, 
                updateOrderStatus, 
                cancelOrder, 
                getSingleOrder,
                placeOrderFromCart

                } = require('../controllers/orderController'); // Import the controller function
                
        const { protect, adminOnly, authorizeRoles } = require('../middleware/authMiddleware'); // middleware to get req.user
      


        // POST /api/orders - Place Order
        router.post('/', protect, placeOrder);
        router.get('/my-orders', protect, getMyOrders);
        router.get('/all', protect, authorizeRoles('admin'), getAllOrders);
        router.patch('/:orderId/status', protect, authorizeRoles('admin'), updateOrderStatus);
        router.patch('/:orderId/cancel', protect, cancelOrder);
        router.get('/:orderId', protect, getSingleOrder);
        router.post('/from-cart', protect, placeOrderFromCart);








        module.exports = router;

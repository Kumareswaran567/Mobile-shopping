// Orders Routes - Get order information
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

/**
 * GET /api/orders/:orderId
 * Get order by order ID
 */
router.get('/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findByOrderId(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order: {
                id: order.id,
                orderId: order.order_id,
                customer: {
                    name: order.customer_name,
                    email: order.customer_email
                },
                mobile: {
                    id: order.mobile_id,
                    brand: order.mobile_brand,
                    model: order.mobile_model,
                    price: order.mobile_price
                },
                cardLast4: order.card_number_last4,
                totalAmount: order.total_amount,
                status: order.status,
                createdAt: order.created_at,
                updatedAt: order.updated_at
            }
        });

    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * GET /api/orders
 * Get all orders (with pagination)
 */
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const offset = parseInt(req.query.offset) || 0;

        const orders = await Order.findAll(limit, offset);

        res.json({
            success: true,
            count: orders.length,
            orders: orders.map(order => ({
                id: order.id,
                orderId: order.order_id,
                customer: {
                    name: order.customer_name,
                    email: order.customer_email
                },
                mobile: {
                    brand: order.mobile_brand,
                    model: order.mobile_model,
                    price: order.mobile_price
                },
                totalAmount: order.total_amount,
                status: order.status,
                createdAt: order.created_at
            }))
        });

    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * GET /api/orders/customer/:email
 * Get orders by customer email
 */
router.get('/customer/:email', async (req, res) => {
    try {
        const { email } = req.params;

        const orders = await Order.findByEmail(email);

        res.json({
            success: true,
            count: orders.length,
            orders: orders.map(order => ({
                id: order.id,
                orderId: order.order_id,
                customer: {
                    name: order.customer_name,
                    email: order.customer_email
                },
                mobile: {
                    brand: order.mobile_brand,
                    model: order.mobile_model,
                    price: order.mobile_price
                },
                totalAmount: order.total_amount,
                status: order.status,
                createdAt: order.created_at
            }))
        });

    } catch (error) {
        console.error('Get customer orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customer orders',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;

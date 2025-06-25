/**
 * Netlify Function: PayPal Order Processing
 * 
 * Handles PayPal payment processing:
 * - POST /api/paypal/order - Create and capture PayPal order
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { storage } from '../../server/storage';

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  console.log(`[NETLIFY] ${event.httpMethod} ${event.path}`);

  // CORS preflight handling
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const requestBody = JSON.parse(event.body);
    const { orderId, userId, items, total } = requestBody;

    // Validate required fields
    if (!orderId || !userId || !items || !total) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Missing required fields',
          message: 'orderId, userId, items, and total are required'
        }),
      };
    }

    // Validate items structure
    if (!Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Invalid items',
          message: 'Items must be a non-empty array'
        }),
      };
    }

    console.log(`[NETLIFY] Processing PayPal order: ${orderId} for user ${userId}`);

    // Here you would typically:
    // 1. Verify the PayPal order with PayPal's API
    // 2. Capture the payment if not already captured
    // 3. Create the order in your database

    // For now, we'll create the order assuming payment is successful
    const orderData = {
      userId: parseInt(userId, 10),
      status: 'processing' as const,
      total: parseFloat(total).toFixed(2),
      stripePaymentIntentId: orderId, // Store PayPal order ID here
    };

    const orderItems = items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: parseFloat(item.price).toFixed(2),
    }));

    // Create order in database
    const order = await storage.createOrder(orderData, orderItems);

    // Clear user's cart after successful order
    await storage.clearCart(parseInt(userId, 10));

    console.log(`[NETLIFY] Order created successfully: ${order.id}`);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        order: {
          id: order.id,
          status: order.status,
          total: order.total,
          createdAt: order.createdAt,
        },
        message: 'Order processed successfully'
      }),
    };

  } catch (error) {
    console.error('[NETLIFY] PayPal order error:', error);

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Order processing failed',
        message: 'An error occurred while processing your order'
      }),
    };
  }
};
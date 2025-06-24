/**
 * Netlify Serverless Function: PayPal Order Management
 * 
 * Handles PayPal order creation and capture:
 * - POST /api/paypal/order - Create PayPal order
 * - POST /api/paypal/order/:orderId/capture - Capture payment
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { createPaypalOrder, capturePaypalOrder } from '../../server/paypal';

/**
 * Parse order ID from URL path for capture requests
 */
function parseOrderId(path: string): string | null {
  // Match patterns like: /.netlify/functions/paypal-order/ORDER_ID/capture
  const captureMatch = path.match(/paypal-order\/([^\/]+)\/capture$/);
  if (captureMatch) {
    return captureMatch[1];
  }
  return null;
}

/**
 * Check if this is a capture request
 */
function isCaptureRequest(path: string): boolean {
  return path.endsWith('/capture');
}

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
    // Check if this is a capture request
    if (isCaptureRequest(event.path)) {
      const orderId = parseOrderId(event.path);
      if (!orderId) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'Order ID is required for capture' }),
        };
      }
      
      console.log(`[NETLIFY] Capturing PayPal order: ${orderId}`);
      
      // Create mock request/response objects for existing PayPal function
      const mockReq = {
        params: { orderID: orderId },
        body: {},
        method: 'POST',
        url: event.path,
      };
      
      let responseData: any = null;
      let statusCode = 200;
      
      const mockRes = {
        status: (code: number) => ({
          json: (data: any) => {
            statusCode = code;
            responseData = data;
            return mockRes;
          }
        }),
        json: (data: any) => {
          responseData = data;
          return mockRes;
        }
      };
      
      // Call existing PayPal capture function
      await capturePaypalOrder(mockReq as any, mockRes as any);
      
      return {
        statusCode,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseData),
      };
    }
    
    // Handle order creation
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
    console.log('[NETLIFY] Creating PayPal order:', requestBody);
    
    // Create mock request/response objects for existing PayPal function
    const mockReq = {
      body: requestBody,
      method: 'POST',
      url: event.path,
    };
    
    let responseData: any = null;
    let statusCode = 200;
    
    const mockRes = {
      status: (code: number) => ({
        json: (data: any) => {
          statusCode = code;
          responseData = data;
          return mockRes;
        }
      }),
      json: (data: any) => {
        responseData = data;
        return mockRes;
      }
    };
    
    // Call existing PayPal order creation function
    await createPaypalOrder(mockReq as any, mockRes as any);
    
    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(responseData),
    };
    
  } catch (error) {
    console.error('[NETLIFY] PayPal order error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'PayPal operation failed' }),
    };
  }
};
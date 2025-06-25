
/**
 * Netlify Function: Shopping Cart Management
 * 
 * Handles cart operations:
 * - GET /api/cart?userId=123 - Get cart items for user
 * - POST /api/cart - Add item to cart
 * - PUT /api/cart/:id - Update cart item quantity
 * - DELETE /api/cart/:id - Remove item from cart
 * - DELETE /api/cart?userId=123 - Clear entire cart
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { insertCartItemSchema } from '../../shared/schema';
import { storage } from '../../server/storage';

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  console.log(`[NETLIFY] ${event.httpMethod} ${event.path}`);
  
  // CORS preflight handling
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: '',
    };
  }
  
  try {
    const queryStringParameters = event.queryStringParameters || {};
    const pathSegments = (event.path || '').split('/');
    const itemId = pathSegments[pathSegments.length - 1];
    
    // Handle GET - Get cart items for user
    if (event.httpMethod === 'GET') {
      const { userId } = queryStringParameters;
      
      if (!userId) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'userId parameter is required' }),
        };
      }
      
      const userIdNum = parseInt(userId, 10);
      if (isNaN(userIdNum)) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'Invalid userId' }),
        };
      }
      
      console.log(`[NETLIFY] Getting cart items for user ${userIdNum}`);
      const cartItems = await storage.getCartItems(userIdNum);
      
      console.log(`[NETLIFY] Returning ${cartItems.length} cart items`);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItems),
      };
    }
    
    // Handle POST - Add item to cart
    if (event.httpMethod === 'POST') {
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
      console.log('[NETLIFY] Adding item to cart:', requestBody);
      
      // Validate request body
      const validationResult = insertCartItemSchema.safeParse(requestBody);
      if (!validationResult.success) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            error: 'Validation failed',
            issues: validationResult.error.issues 
          }),
        };
      }
      
      // Add to cart
      const cartItem = await storage.addToCart(validationResult.data);
      
      console.log(`[NETLIFY] Item added to cart: ${cartItem.id}`);
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          cartItem,
          message: 'Item added to cart'
        }),
      };
    }
    
    // Handle PUT - Update cart item quantity
    if (event.httpMethod === 'PUT') {
      if (!itemId || itemId === 'cart') {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'Cart item ID is required in URL path' }),
        };
      }
      
      const cartItemId = parseInt(itemId, 10);
      if (isNaN(cartItemId)) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'Invalid cart item ID' }),
        };
      }
      
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
      
      const { quantity } = JSON.parse(event.body);
      
      if (typeof quantity !== 'number' || quantity < 1) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'Quantity must be a positive number' }),
        };
      }
      
      console.log(`[NETLIFY] Updating cart item ${cartItemId} quantity to ${quantity}`);
      const updatedItem = await storage.updateCartItem(cartItemId, quantity);
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          cartItem: updatedItem,
          message: 'Cart item updated'
        }),
      };
    }
    
    // Handle DELETE - Remove item from cart or clear entire cart
    if (event.httpMethod === 'DELETE') {
      // Clear entire cart for user
      if (queryStringParameters.userId) {
        const userId = parseInt(queryStringParameters.userId, 10);
        if (isNaN(userId)) {
          return {
            statusCode: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: 'Invalid userId' }),
          };
        }
        
        console.log(`[NETLIFY] Clearing cart for user ${userId}`);
        await storage.clearCart(userId);
        
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: true,
            message: 'Cart cleared'
          }),
        };
      }
      
      // Remove specific item
      if (!itemId || itemId === 'cart') {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'Cart item ID is required in URL path' }),
        };
      }
      
      const cartItemId = parseInt(itemId, 10);
      if (isNaN(cartItemId)) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'Invalid cart item ID' }),
        };
      }
      
      console.log(`[NETLIFY] Removing cart item ${cartItemId}`);
      await storage.removeFromCart(cartItemId);
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          message: 'Item removed from cart'
        }),
      };
    }
    
    // Method not allowed
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
    
  } catch (error) {
    console.error('[NETLIFY] Cart error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

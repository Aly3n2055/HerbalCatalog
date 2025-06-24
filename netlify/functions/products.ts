/**
 * Netlify Serverless Function: Products API
 * 
 * Handles all product-related API endpoints:
 * - GET /api/products - List products with filtering
 * - GET /api/products/:id - Get single product
 * 
 * This function replaces the Express.js routes for Netlify deployment.
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { storage } from '../../server/storage';

interface ProductQuery {
  category?: string;
  search?: string;
  featured?: string;
}

/**
 * Parse product ID from URL path
 * Extracts ID from paths like /.netlify/functions/products/123
 */
function parseProductId(path: string): number | null {
  const segments = path.split('/');
  const lastSegment = segments[segments.length - 1];
  
  // Check if last segment is numeric
  if (lastSegment && /^\d+$/.test(lastSegment)) {
    return parseInt(lastSegment, 10);
  }
  
  return null;
}

/**
 * Main handler function for products API
 */
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
    const productId = parseProductId(event.path);
    
    // Handle single product request
    if (productId) {
      if (event.httpMethod !== 'GET') {
        return {
          statusCode: 405,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
      }
      
      console.log(`[NETLIFY] Fetching product ${productId}`);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'Product not found' }),
        };
      }
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300', // 5 minutes cache
        },
        body: JSON.stringify(product),
      };
    }
    
    // Handle products list request
    if (event.httpMethod === 'GET') {
      const query: ProductQuery = event.queryStringParameters || {};
      const { category, search, featured } = query;
      
      console.log('[NETLIFY] Products query:', { category, search, featured });
      
      let products;
      
      if (category) {
        console.log(`[NETLIFY] Filtering by category: ${category}`);
        products = await storage.getProductsByCategory(category);
      } else if (search) {
        console.log(`[NETLIFY] Searching for: ${search}`);
        products = await storage.searchProducts(search);
      } else if (featured === 'true') {
        console.log('[NETLIFY] Fetching featured products');
        products = await storage.getFeaturedProducts();
      } else {
        console.log('[NETLIFY] Fetching all products');
        products = await storage.getProducts();
      }
      
      console.log(`[NETLIFY] Returning ${products.length} products`);
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300', // 5 minutes cache
        },
        body: JSON.stringify(products),
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
    console.error('[NETLIFY] Products API error:', error);
    
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
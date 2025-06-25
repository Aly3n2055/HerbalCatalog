/**
 * Netlify Function: Products API
 * 
 * Handles product-related requests:
 * - GET /api/products - List all products with optional filtering
 * - GET /api/products?category=slug - Filter by category
 * - GET /api/products?featured=true - Get featured products
 * - GET /api/products?search=query - Search products
 * - GET /api/products/:id - Get single product (handled via path parameters)
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
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: '',
    };
  }

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

  try {
    const queryStringParameters = event.queryStringParameters || {};
    const { category, featured, search, id } = queryStringParameters;

    let products;

    // Handle single product request
    if (id) {
      const productId = parseInt(id, 10);
      if (isNaN(productId)) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'Invalid product ID' }),
        };
      }

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

      console.log(`[NETLIFY] Returning product: ${product.id}`);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        },
        body: JSON.stringify(product),
      };
    }

    // Handle search request
    if (search) {
      console.log(`[NETLIFY] Searching products: ${search}`);
      products = await storage.searchProducts(search);
    }
    // Handle featured products request
    else if (featured === 'true') {
      console.log('[NETLIFY] Fetching featured products');
      products = await storage.getFeaturedProducts();
    }
    // Handle category filter
    else if (category) {
      console.log(`[NETLIFY] Fetching products by category: ${category}`);
      products = await storage.getProductsByCategory(category);
    }
    // Handle all products request
    else {
      console.log('[NETLIFY] Fetching all products');
      products = await storage.getProducts();
    }

    console.log(`[NETLIFY] Returning ${products.length} products`);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
      body: JSON.stringify(products),
    };

  } catch (error) {
    console.error('[NETLIFY] Products error:', error);

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
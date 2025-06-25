
/**
 * Netlify Function: Categories API
 * 
 * Handles category-related requests:
 * - GET /api/categories - List all categories
 * - GET /api/categories?slug=category-slug - Get single category
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
    const { slug } = queryStringParameters;
    
    // Handle single category request
    if (slug) {
      console.log(`[NETLIFY] Fetching category: ${slug}`);
      const category = await storage.getCategory(slug);
      
      if (!category) {
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'Category not found' }),
        };
      }
      
      console.log(`[NETLIFY] Returning category: ${category.name}`);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=600', // Cache for 10 minutes
        },
        body: JSON.stringify(category),
      };
    }
    
    // Handle all categories request
    console.log('[NETLIFY] Fetching all categories');
    const categories = await storage.getCategories();
    
    console.log(`[NETLIFY] Returning ${categories.length} categories`);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600', // Cache for 10 minutes
      },
      body: JSON.stringify(categories),
    };
    
  } catch (error) {
    console.error('[NETLIFY] Categories error:', error);
    
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

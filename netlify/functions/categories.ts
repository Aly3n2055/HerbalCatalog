/**
 * Netlify Serverless Function: Categories API
 * 
 * Handles category-related API endpoints:
 * - GET /api/categories - List all categories
 * - GET /api/categories/:slug - Get single category by slug
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { storage } from '../../server/storage';

/**
 * Parse category slug from URL path
 */
function parseCategorySlug(path: string): string | null {
  const segments = path.split('/');
  const lastSegment = segments[segments.length - 1];
  
  // Check if last segment is not 'categories' (meaning it's a slug)
  if (lastSegment && lastSegment !== 'categories') {
    return lastSegment;
  }
  
  return null;
}

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
    const categorySlug = parseCategorySlug(event.path);
    
    // Handle single category request
    if (categorySlug) {
      console.log(`[NETLIFY] Fetching category: ${categorySlug}`);
      const category = await storage.getCategory(categorySlug);
      
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
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=600', // 10 minutes cache
        },
        body: JSON.stringify(category),
      };
    }
    
    // Handle categories list request
    console.log('[NETLIFY] Fetching all categories');
    const categories = await storage.getCategories();
    
    console.log(`[NETLIFY] Returning ${categories.length} categories`);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600', // 10 minutes cache
      },
      body: JSON.stringify(categories),
    };
    
  } catch (error) {
    console.error('[NETLIFY] Categories API error:', error);
    
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
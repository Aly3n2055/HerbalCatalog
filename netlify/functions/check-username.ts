
/**
 * Netlify Function: Check Username Availability
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
    const username = event.queryStringParameters?.username;
    
    if (!username) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Username parameter is required' }),
      };
    }
    
    // Basic validation
    if (username.length < 3 || username.length > 20) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          available: false,
          reason: 'Username must be between 3 and 20 characters'
        }),
      };
    }
    
    if (!/^[a-z0-9_]+$/.test(username)) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          available: false,
          reason: 'Username can only contain lowercase letters, numbers, and underscores'
        }),
      };
    }
    
    if (!/^[a-z]/.test(username)) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          available: false,
          reason: 'Username must start with a letter'
        }),
      };
    }
    
    // Check reserved usernames
    const reserved = [
      'admin', 'administrator', 'root', 'api', 'www', 'mail', 'email',
      'support', 'help', 'info', 'contact', 'sales', 'marketing',
      'system', 'user', 'users', 'account', 'accounts', 'profile',
      'settings', 'config', 'test', 'demo', 'sample', 'null', 'undefined'
    ];
    
    if (reserved.includes(username)) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          available: false,
          reason: 'This username is reserved'
        }),
      };
    }
    
    // Check if username exists in database
    const existingUser = await storage.getUserByUsername(username);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        available: !existingUser,
        reason: existingUser ? 'Username is already taken' : undefined
      }),
    };
    
  } catch (error) {
    console.error('[NETLIFY] Username check error:', error);
    
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

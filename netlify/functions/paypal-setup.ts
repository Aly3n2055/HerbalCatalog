
/**
 * Netlify Function: PayPal Setup
 * 
 * Provides PayPal configuration for client-side integration
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

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
    const clientId = process.env.PAYPAL_CLIENT_ID;
    
    if (!clientId) {
      console.error('[NETLIFY] PayPal client ID not configured');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'PayPal configuration missing',
          message: 'PayPal client ID not configured'
        }),
      };
    }
    
    console.log('[NETLIFY] Returning PayPal configuration');
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
      body: JSON.stringify({
        clientId,
        currency: 'USD',
        intent: 'capture',
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
      }),
    };
    
  } catch (error) {
    console.error('[NETLIFY] PayPal setup error:', error);
    
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

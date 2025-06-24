/**
 * Netlify Serverless Function: PayPal Setup
 * 
 * Generates PayPal client token for SDK initialization.
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { getClientToken } from '../../server/paypal';

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
    console.log('[NETLIFY] Generating PayPal client token');
    
    const clientToken = await getClientToken();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache', // Don't cache tokens
      },
      body: JSON.stringify({ clientToken }),
    };
    
  } catch (error) {
    console.error('[NETLIFY] PayPal setup error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Failed to initialize PayPal' }),
    };
  }
};
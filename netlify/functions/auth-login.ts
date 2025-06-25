
/**
 * Netlify Function: User Login
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { loginSchema } from '../../shared/schema';
import { storage } from '../../server/storage';
import bcrypt from 'bcrypt';

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
    console.log('[NETLIFY] Login attempt:', requestBody.email);
    
    // Validate request body
    const validationResult = loginSchema.safeParse(requestBody);
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
    
    const { email, password } = validationResult.data;
    
    // Find user
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        }),
      };
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        }),
      };
    }
    
    console.log(`[NETLIFY] Login successful: ${user.id} (${user.email})`);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        user: userWithoutPassword,
        message: 'Login successful'
      }),
    };
    
  } catch (error) {
    console.error('[NETLIFY] Login error:', error);
    
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

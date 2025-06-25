
/**
 * Netlify Function: User Registration
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { registerSchema } from '../../shared/schema';
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
    console.log('[NETLIFY] Registration attempt:', requestBody.email);
    
    // Validate request body
    const validationResult = registerSchema.safeParse(requestBody);
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
    
    const { email, password, username, firstName, lastName, phone } = validationResult.data;
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return {
        statusCode: 409,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'User already exists',
          message: 'An account with this email already exists'
        }),
      };
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await storage.createUser({
      email,
      password: hashedPassword,
      username,
      firstName,
      lastName,
      phone,
      role: 'customer'
    });
    
    console.log(`[NETLIFY] User created: ${user.id} (${user.email})`);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        user: userWithoutPassword,
        message: 'Registration successful'
      }),
    };
    
  } catch (error) {
    console.error('[NETLIFY] Registration error:', error);
    
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

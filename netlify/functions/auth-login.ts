/**
 * Netlify Serverless Function: User Login
 * 
 * Handles user authentication with password verification.
 * For production deployment, consider using JWT tokens instead of sessions.
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import bcrypt from 'bcrypt';
import { loginSchema } from '../../shared/schema';
import { storage } from '../../server/storage';

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
    console.log('[NETLIFY] Login attempt for:', requestBody.email);
    
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
    
    // Find user by email
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }
    
    // Return user data (excluding password hash)
    const { passwordHash: _, ...userResponse } = user;
    
    console.log(`[NETLIFY] User logged in successfully: ${user.id}`);
    
    // Note: In a real serverless deployment, you would generate and return a JWT token here
    // For now, returning user data for compatibility with existing frontend
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: userResponse,
        // In production, include JWT token:
        // token: generateJWT(user.id)
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
      body: JSON.stringify({ error: 'Login failed' }),
    };
  }
};
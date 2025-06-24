/**
 * Netlify Serverless Function: User Registration
 * 
 * Handles user registration with password hashing and validation.
 * Note: Session management in serverless functions requires external session store.
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import bcrypt from 'bcrypt';
import { registerSchema } from '../../shared/schema';
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
    console.log('[NETLIFY] Registration attempt for:', requestBody.email);
    
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
    
    const { email, password, firstName, lastName } = validationResult.data;
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return {
        statusCode: 409,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Email already registered' }),
      };
    }
    
    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const user = await storage.createUser({
      email,
      passwordHash,
      firstName,
      lastName,
    });
    
    // Return user data (excluding password hash)
    const { passwordHash: _, ...userResponse } = user;
    
    console.log(`[NETLIFY] User registered successfully: ${user.id}`);
    
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userResponse),
    };
    
  } catch (error) {
    console.error('[NETLIFY] Registration error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Registration failed' }),
    };
  }
};
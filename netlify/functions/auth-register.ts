import { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { registerSchema } from '../../shared/schema';

const sql = neon(process.env.DATABASE_URL!);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    console.log('Registration attempt for:', body.email, body.username);

    // Validate input
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${validatedData.email} OR username = ${validatedData.username}
    `;

    if (existingUser.length > 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({
          success: false,
          message: 'User with this email or username already exists',
        }),
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const [newUser] = await sql`
      INSERT INTO users (email, username, password_hash, first_name, last_name, phone, role)
      VALUES (
        ${validatedData.email},
        ${validatedData.username},
        ${hashedPassword},
        ${validatedData.firstName || null},
        ${validatedData.lastName || null},
        ${validatedData.phone || null},
        ${validatedData.role || 'customer'}
      )
      RETURNING id, email, username, first_name, last_name, phone, role, created_at, updated_at
    `;

    // Format user data for response
    const userData = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      phone: newUser.phone,
      role: newUser.role,
      createdAt: newUser.created_at,
      updatedAt: newUser.updated_at,
    };

    console.log('User registered successfully:', userData.id);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        success: true,
        user: userData,
        message: 'Registration successful',
      }),
    };
  } catch (error: any) {
    console.error('Registration error:', error);

    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        success: false,
        message: error.message || 'Registration failed',
      }),
    };
  }
};
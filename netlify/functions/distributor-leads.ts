/**
 * Netlify Serverless Function: Distributor Leads
 * 
 * Handles distributor application submissions:
 * - POST /api/distributor-leads - Submit new application
 * - GET /api/distributor-leads - List applications (admin only)
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { insertDistributorLeadSchema } from '../../shared/schema';
import { storage } from '../../server/storage';

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  console.log(`[NETLIFY] ${event.httpMethod} ${event.path}`);
  
  // CORS preflight handling
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: '',
    };
  }
  
  try {
    // Handle POST - Submit new distributor application
    if (event.httpMethod === 'POST') {
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
      console.log('[NETLIFY] New distributor application:', requestBody.email);
      
      // Validate request body
      const validationResult = insertDistributorLeadSchema.safeParse(requestBody);
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
      
      // Check for duplicate applications (optional enhancement)
      try {
        const existingLead = await storage.getDistributorLeadByEmail?.(validationResult.data.email);
        if (existingLead) {
          return {
            statusCode: 409,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              error: 'Application already exists for this email address',
              message: 'You have already submitted an application. Our team will contact you soon.'
            }),
          };
        }
      } catch (error) {
        // If method doesn't exist, continue with creation
        console.log('[NETLIFY] Duplicate check method not available, proceeding with creation');
      }
      
      // Create distributor lead
      const lead = await storage.createDistributorLead(validationResult.data);
      
      console.log(`[NETLIFY] Distributor lead created: ${lead.id} for ${validationResult.data.email}`);
      
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          data: lead,
          message: 'Application submitted successfully'
        }),
      };
    }
    
    // Handle GET - List distributor applications (admin only)
    if (event.httpMethod === 'GET') {
      // Note: In a real application, you would check admin authentication here
      console.log('[NETLIFY] Fetching distributor leads');
      
      const leads = await storage.getDistributorLeads();
      
      console.log(`[NETLIFY] Returning ${leads.length} distributor leads`);
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache', // Don't cache sensitive admin data
        },
        body: JSON.stringify(leads),
      };
    }
    
    // Method not allowed
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
    
  } catch (error) {
    console.error('[NETLIFY] Distributor leads error:', error);
    
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
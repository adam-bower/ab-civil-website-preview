/**
 * Database Explorer for Claude Code
 * Provides live access to Supabase database for queries and exploration
 */

import { supabase } from '../lib/supabase';

// Tables discovered from React app analysis
const KNOWN_TABLES = [
  // Core business tables
  'projects',
  'projects_with_job_display', // View
  'subitems',
  'clients',
  'contacts',
  'employees',
  
  // Discrepancy system
  'discrepancies',
  'discrepancy_and_clarification_type',
  
  // Export/takeoff system
  'export_and_send',
  'takeoff_projects',
  'model_quotes'
];

export class DatabaseExplorer {
  
  /**
   * Test connection to Supabase
   */
  static async testConnection() {
    try {
      const { data, error } = await supabase.from('projects').select('count').limit(1);
      if (error) throw error;
      return { success: true, message: 'Connection successful' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Get list of all known tables with record counts
   */
  static async listTables() {
    const results = [];
    
    for (const table of KNOWN_TABLES) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          results.push({ table, status: 'error', count: null, error: error.message });
        } else {
          results.push({ table, status: 'success', count, error: null });
        }
      } catch (err) {
        results.push({ table, status: 'error', count: null, error: err.message });
      }
    }
    
    return results;
  }

  /**
   * Explore a specific table structure and sample data
   */
  static async exploreTable(tableName, limit = 5) {
    try {
      // Get sample data
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(limit);
      
      if (error) throw error;
      
      const result = {
        table: tableName,
        recordCount: data?.length || 0,
        columns: data?.length > 0 ? Object.keys(data[0]) : [],
        sampleData: data || []
      };
      
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Query a specific table with filters
   */
  static async queryTable(tableName, options = {}) {
    try {
      let query = supabase.from(tableName).select(options.select || '*');
      
      // Apply filters
      if (options.filters) {
        options.filters.forEach(filter => {
          const { column, operator, value } = filter;
          switch (operator) {
            case 'eq':
              query = query.eq(column, value);
              break;
            case 'neq':
              query = query.neq(column, value);
              break;
            case 'like':
              query = query.like(column, `%${value}%`);
              break;
            case 'ilike':
              query = query.ilike(column, `%${value}%`);
              break;
            case 'gt':
              query = query.gt(column, value);
              break;
            case 'lt':
              query = query.lt(column, value);
              break;
            case 'gte':
              query = query.gte(column, value);
              break;
            case 'lte':
              query = query.lte(column, value);
              break;
            case 'in':
              query = query.in(column, value);
              break;
          }
        });
      }
      
      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending !== false 
        });
      }
      
      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get recent projects with their details
   */
  static async getRecentProjects(limit = 10) {
    return this.queryTable('projects', {
      select: 'id, name, job_number, status, created_at, updated_at',
      orderBy: { column: 'updated_at', ascending: false },
      limit
    });
  }

  /**
   * Get recent clients
   */
  static async getRecentClients(limit = 10) {
    return this.queryTable('clients', {
      select: 'id, name, created_at, updated_at',
      orderBy: { column: 'updated_at', ascending: false },
      limit
    });
  }

  /**
   * Get recent discrepancies
   */
  static async getRecentDiscrepancies(limit = 10) {
    return this.queryTable('discrepancies', {
      select: 'id, name, type, status, email_preview, send_email, sent_date, created_at',
      orderBy: { column: 'created_at', ascending: false },
      limit
    });
  }

  /**
   * Get email templates
   */
  static async getEmailTemplates() {
    return this.queryTable('discrepancy_and_clarification_type', {
      select: 'id, name, email_body_text, email_preview, created_at, updated_at',
      orderBy: { column: 'name', ascending: true }
    });
  }

  /**
   * Check if a column exists in a table
   */
  static async checkColumn(tableName, columnName) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select(columnName)
        .limit(1);
      
      if (error) {
        if (error.message.includes(columnName)) {
          return { exists: false, error: `Column ${columnName} does not exist` };
        }
        return { exists: false, error: error.message };
      }
      
      return { exists: true };
    } catch (error) {
      return { exists: false, error: error.message };
    }
  }

  /**
   * Get table statistics
   */
  static async getTableStats(tableName) {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      
      // Get recent activity (if has created_at or updated_at)
      let recentActivity = null;
      try {
        const { data: recent } = await supabase
          .from(tableName)
          .select('created_at, updated_at')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (recent && recent.length > 0) {
          recentActivity = recent[0];
        }
      } catch {
        // Table might not have created_at/updated_at columns
      }
      
      return {
        success: true,
        data: {
          table: tableName,
          totalRecords: count,
          recentActivity
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default DatabaseExplorer;
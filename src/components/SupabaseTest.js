import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://db.ab-civil.com';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function SupabaseTest() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing connection...\n');

    try {
      // Test 1: Basic connection
      const { data: healthCheck, error: healthError } = await supabaseClient
        .from('pricing_calculator_quote')
        .select('count', { count: 'exact', head: true });

      if (healthError) {
        setResult(prev => prev + `\n❌ Table access error: ${healthError.message}\n`);
      } else {
        setResult(prev => prev + `\n✅ Table exists and is accessible\n`);
      }

      // Test 2: Try a minimal insert
      const testData = {
        project_name: 'TEST_PROJECT',
        customer_name: 'Test User',
        company_name: 'Test Company',
        email_address: 'test@example.com',
        project_type: 'Typical Surface Model',
        acreage: 1,
        estimated_cost: 100
      };

      setResult(prev => prev + `\nAttempting test insert...\n`);
      
      const { data: insertData, error: insertError } = await supabaseClient
        .from('pricing_calculator_quote')
        .insert([testData])
        .select();

      if (insertError) {
        setResult(prev => prev + `\n❌ Insert error: ${insertError.message}\n`);
        setResult(prev => prev + `Error details: ${JSON.stringify(insertError, null, 2)}\n`);
      } else {
        setResult(prev => prev + `\n✅ Insert successful!\n`);
        setResult(prev => prev + `Inserted data: ${JSON.stringify(insertData, null, 2)}\n`);
        
        // Clean up test data
        if (insertData && insertData[0] && insertData[0].id) {
          await supabaseClient
            .from('pricing_calculator_quote')
            .delete()
            .eq('id', insertData[0].id);
          setResult(prev => prev + `\n🧹 Test data cleaned up\n`);
        }
      }

    } catch (error) {
      setResult(prev => prev + `\n❌ Unexpected error: ${error.message}\n`);
    }

    setLoading(false);
  };

  const checkTableStructure = async () => {
    setLoading(true);
    setResult('Checking table structure...\n');

    try {
      // Try to get table info
      const { data, error } = await supabaseClient
        .from('pricing_calculator_quote')
        .select('*')
        .limit(0);

      if (error) {
        setResult(prev => prev + `\n❌ Cannot access table structure: ${error.message}\n`);
      } else {
        setResult(prev => prev + `\n✅ Table structure check passed\n`);
      }

    } catch (error) {
      setResult(prev => prev + `\n❌ Error: ${error.message}\n`);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Supabase Connection Test</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={testConnection} 
          disabled={loading}
          style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}
        >
          Test Insert
        </button>
        
        <button 
          onClick={checkTableStructure} 
          disabled={loading}
          style={{ padding: '0.5rem 1rem' }}
        >
          Check Table
        </button>
      </div>

      <pre style={{ 
        background: '#f5f5f5', 
        padding: '1rem', 
        borderRadius: '4px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        {result || 'Click a button to test the connection'}
      </pre>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#e3f2fd', borderRadius: '4px' }}>
        <h3>To fix 403 errors:</h3>
        <ol>
          <li>Enable RLS on the table if not already enabled</li>
          <li>Create an INSERT policy for anonymous users:</li>
        </ol>
        <pre style={{ background: '#fff', padding: '1rem', marginTop: '0.5rem' }}>
{`-- Enable RLS
ALTER TABLE pricing_calculator_quote ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON pricing_calculator_quote
FOR INSERT TO anon
WITH CHECK (true);

-- Allow anonymous to read their own submissions (optional)
CREATE POLICY "Allow read own submissions" ON pricing_calculator_quote
FOR SELECT TO anon
USING (true);`}
        </pre>
      </div>
    </div>
  );
}

export default SupabaseTest;
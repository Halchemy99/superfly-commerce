import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart, Users, FileUp, Send, UserCheck, Clock, AlertCircle, CheckCircle, Search, Mail } from 'lucide-react';
import type { Profile } from '../pages/AccountPage'; // We will export this type from AccountPage

// Define types for our data
type Order = {
  id: number;
  created_at: string;
  customer_email: string;
  total_amount: number;
  currency: string;
  order_items: { service_name: string, quantity: number }[];
};

type Verification = {
  id: number;
  user_id: string;
  created_at: string;
  contact_name: string;
  contact_email: string;
  requested_level: number;
  status: string;
  file_paths: string[];
};

type AdminUser = {
  id: string;
  full_name: string;
  email: string; // We'll join this from auth.users
  role: string;
  sustainability_level: number;
};

// ------ TABS ------
const TABS = {
  DASHBOARD: 'Dashboard',
  USERS: 'User Management',
  CONTRACTS: 'Contract Management',
  VERIFICATIONS: 'Pending Verifications',
};

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h2>

      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b border-gray-200 mb-8">
        {Object.values(TABS).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-semibold text-sm transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab === TABS.DASHBOARD && <BarChart className="w-4 h-4 inline-block mr-2" />}
            {tab === TABS.USERS && <Users className="w-4 h-4 inline-block mr-2" />}
            {tab === TABS.CONTRACTS && <FileUp className="w-4 h-4 inline-block mr-2" />}
            {tab === TABS.VERIFICATIONS && <UserCheck className="w-4 h-4 inline-block mr-2" />}
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === TABS.DASHBOARD && <SalesDashboard />}
        {activeTab === TABS.USERS && <UserManagement />}
        {activeTab === TABS.CONTRACTS && <ContractManagement />}
        {activeTab === TABS.VERIFICATIONS && <VerificationManagement />}
      </div>
    </div>
  );
};

// ------ SALES DASHBOARD COMPONENT ------
const SalesDashboard = () => {
  const [period, setPeriod] = useState('month');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      
      const date = new Date();
      let fromDate = '';
      if (period === 'week') {
        date.setDate(date.getDate() - 7);
        fromDate = date.toISOString();
      } else if (period === 'month') {
        date.setMonth(date.getMonth() - 1);
        fromDate = date.toISOString();
      } else if (period === 'year') {
        date.setFullYear(date.getFullYear() - 1);
        fromDate = date.toISOString();
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, created_at, customer_email, total_amount, currency,
          order_items ( service_name, quantity )
        `)
        .gte('created_at', fromDate)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sales data:', error);
      } else if (data) {
        setOrders(data as Order[]);
      }
      setLoading(false);
    };

    fetchSalesData();
  }, [period]);

  const totalSales = orders.reduce((acc, order) => acc + order.total_amount, 0);

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Sales Dashboard</h3>
      <div className="flex gap-2 mb-6">
        {['week', 'month', 'year'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg font-medium text-sm capitalize ${
              period === p ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            This {p}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <h4 className="text-sm font-semibold text-green-700 mb-2">Total Sales ({period})</h4>
          <div className="text-3xl font-bold text-green-900">£{totalSales.toFixed(2)}</div>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-700 mb-2">Total Orders ({period})</h4>
          <div className="text-3xl font-bold text-blue-900">{orders.length}</div>
        </div>
      </div>

      <h4 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase p-3">Date</th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase p-3">Email</th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase p-3">Items</th>
              <th className="text-right text-xs font-semibold text-gray-600 uppercase p-3">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">No orders found for this period.</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td className="p-3 text-sm text-gray-700">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-sm text-gray-700">{order.customer_email}</td>
                  <td className="p-3 text-sm text-gray-700">
                    {order.order_items.map(item => `${item.quantity}x ${item.service_name}`).join(', ')}
                  </td>
                  <td className="p-3 text-sm text-gray-900 font-medium text-right">£{order.total_amount.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ------ USER MANAGEMENT COMPONENT ------
const UserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      // We need to use an RPC call to join profiles with auth.users
      // This is safer than exposing auth.users directly.
      // First, let's create the RPC function in Supabase SQL Editor:
      /*
        CREATE OR REPLACE FUNCTION get_all_users()
        RETURNS TABLE (
          id uuid,
          full_name text,
          email text,
          role text,
          sustainability_level int
        ) AS $$
        BEGIN
          IF is_admin() THEN -- Reuse our admin check function
            RETURN QUERY
            SELECT
              p.id,
              p.full_name,
              u.email,
              p.role,
              p.sustainability_level
            FROM
              public.profiles p
            JOIN
              auth.users u ON p.id = u.id;
          ELSE
            RAISE EXCEPTION 'Not authorized';
          END IF;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      */
      const { data, error } = await supabase.rpc('get_all_users');

      if (error) {
        console.error('Error fetching users:', error);
        setMessage({type: 'error', text: 'You must be an admin to view users. Have you created the get_all_users() RPC function in Supabase?'});
      } else if (data) {
        setUsers(data as AdminUser[]);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handlePasswordReset = async (email: string) => {
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth` // Where user resets their password
    });
    if (error) {
      setMessage({type: 'error', text: error.message});
    } else {
      setMessage({type: 'success', text: `Password reset email sent to ${email}!`});
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">User Management</h3>
      <p className="text-sm text-gray-600 mb-6">
        View all registered users. You must create the `get_all_users()` RPC function in Supabase for this to work.
      </p>

      {message && (
        <div className={`p-4 rounded-lg mb-4 text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase p-3">Name</th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase p-3">Email</th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase p-3">Role</th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase p-3">Sust. Level</th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">No users found.</td></tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td className="p-3 text-sm text-gray-700">{user.full_name || 'N/A'}</td>
                  <td className="p-3 text-sm text-gray-700">{user.email}</td>
                  <td className="p-3 text-sm text-gray-700">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-900 font-medium text-center">{user.sustainability_level}</td>
                  <td className="p-3 text-sm">
                    <button 
                      onClick={() => handlePasswordReset(user.email)}
                      className="flex items-center text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Send Reset
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ------ CONTRACT MANAGEMENT COMPONENT ------
const ContractManagement = () => {
  const [file, setFile] = useState<File | null>(null);
  const [signerEmail, setSignerEmail] = useState('');
  const [signerName, setSignerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !signerEmail || !signerName) {
      setMessage({type: 'error', text: 'All fields are required.'});
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Step 1: Upload file to our server, which uploads to Supabase
      const formData = new FormData();
      formData.append('contractFile', file);
      const API_URL = import.meta.env.VITE_API_URL;
      const uploadResponse = await fetch(`${API_URL}/api/upload-contract`, {
        method: 'POST',
        body: formData,
      });

      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || 'File upload failed.');
      }
      
      const contractUrl = uploadResult.publicUrl;

// Step 2: Send file to Docusign via our server
      // We send the 'path' so the server can download it directly using Admin keys
      const docusignResponse = await fetch(`${API_URL}/api/send-signature-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signerEmail,
          signerName,
          contractPath: uploadResult.path, // <--- CHANGE: Send 'path', not 'contractUrl'
          contractName: file.name
        }),
      });

      const docusignResult = await docusignResponse.json();
      if (!docusignResponse.ok) {
        throw new Error(docusignResult.error || 'Docusign request failed.');
      }

      setMessage({type: 'success', text: `Contract sent to ${signerEmail}! Envelope ID: ${docusignResult.envelopeId}`});
      setFile(null);
      setSignerEmail('');
      setSignerName('');

    } catch (error: any) {
      setMessage({type: 'error', text: error.message});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Contract Management</h3>
      <p className="text-sm text-gray-600 mb-6">
        Upload a contract (PDF, DOCX) and send it for signature via Docusign.
      </p>

      {message && (
        <div className={`p-4 rounded-lg mb-4 text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            1. Contract File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
        </div>
        <div>
          <label htmlFor="signerName" className="block text-sm font-medium text-gray-700 mb-2">
            2. Signer's Full Name
          </label>
          <input
            id="signerName"
            type="text"
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label htmlFor="signerEmail" className="block text-sm font-medium text-gray-700 mb-2">
            3. Signer's Email
          </label>
          <input
            id="signerEmail"
            type="email"
            value={signerEmail}
            onChange={(e) => setSignerEmail(e.target.value)}
            placeholder="jane.doe@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center px-8 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold text-lg disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Upload & Send for Signature
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// ------ VERIFICATION MANAGEMENT COMPONENT ------
const VerificationManagement = () => {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sustainability_verifications')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching verifications:', error);
      setMessage({type: 'error', text: 'Could not fetch verification requests.'});
    } else {
      setVerifications(data as Verification[]);
    }
    setLoading(false);
  };

  const handleApprove = async (verification: Verification) => {
    setMessage(null);
    try {
      // This logic should be an RPC function for security, but for now
      // we'll use the client.
      /*
        CREATE OR REPLACE FUNCTION approve_verification(v_id bigint, v_user_id uuid, v_level int)
        RETURNS void AS $$
        BEGIN
          IF is_admin() THEN
            -- 1. Update verification status
            UPDATE public.sustainability_verifications
            SET status = 'approved'
            WHERE id = v_id;

            -- 2. Update user's profile
            UPDATE public.profiles
            SET sustainability_level = v_level
            WHERE id = v_user_id;
          ELSE
            RAISE EXCEPTION 'Not authorized';
          END IF;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      */
      const { error } = await supabase.rpc('approve_verification', {
        v_id: verification.id,
        v_user_id: verification.user_id,
        v_level: verification.requested_level
      });

      if (error) throw error;
      
      setMessage({type: 'success', text: `Approved ${verification.contact_email} for Level ${verification.requested_level}!`});
      fetchVerifications(); // Refresh list

    } catch (error: any) {
      setMessage({type: 'error', text: 'Approval failed. Have you created the `approve_verification` RPC function in Supabase?'});
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Pending Verifications</h3>
      <p className="text-sm text-gray-600 mb-6">
        Approve or deny sustainability level requests.
      </p>

      {message && (
        <div className={`p-4 rounded-lg mb-4 text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          <p className="text-gray-500">Loading verifications...</p>
        ) : verifications.length === 0 ? (
          <p className="text-gray-500">No pending verifications found.</p>
        ) : (
          verifications.map(v => (
            <div key={v.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <div className="font-semibold text-gray-900">{v.contact_name}</div>
                  <div className="text-sm text-gray-600">{v.contact_email}</div>
                  <div className="text-sm text-gray-500">{v.company_name}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Requesting</div>
                  <div className="font-bold text-xl text-green-600">Level {v.requested_level}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Status</div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    v.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {v.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={v.status === 'approved'}
                    onClick={() => handleApprove(v)}
                    className="flex items-center text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approve
                  </button>
                  {/* Add a button to view files if file_paths is not empty */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

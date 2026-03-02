import React, { useEffect, useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, FileText, ShoppingBag, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import AdminPanel from '../components/AdminPanel'; // <-- Import the new Admin Panel

// --- TYPES ---
// Export this type so AdminPanel can use it
export type Profile = {
  id: string;
  full_name: string;
  company_name: string;
  role: 'user' | 'admin';
  sustainability_level: number;
};

type Order = {
  id: number;
  created_at: string;
  total_amount: number;
  currency: string;
  order_items: { service_name: string, quantity: number }[];
};

type AccountTab = 'profile' | 'orders' | 'admin';

// --- MAIN COMPONENT ---
const AccountPage = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AccountTab>('profile');
  const navigate = useNavigate();

  // Fetch user and profile data on load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // 1. Get Auth User
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // 2. Get User Profile (with role)
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // If no profile, user might be stuck. Log them out.
          await supabase.auth.signOut();
          navigate('/auth');
        } else if (profileData) {
          setProfile(profileData as Profile);
        }
      } else {
        // If no user, redirect to login
        navigate('/auth');
      }
      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-12">
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl sm:truncate">
              My Account
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Welcome back, {profile.full_name || user.email}!
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="mt-4 md:mt-0 md:ml-4 group flex items-center justify-center px-6 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm disabled:opacity-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className="w-5 h-5 mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              My Orders
            </button>
            
            {/* CONDITIONAL ADMIN TAB */}
            {profile.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'admin'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Shield className="w-5 h-5 mr-2" />
                Admin Panel
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'profile' && <ProfilePanel profile={profile} user={user} />}
          {activeTab === 'orders' && <OrdersPanel />}
          {activeTab === 'admin' && profile.role === 'admin' && <AdminPanel />}
        </div>
      </div>
    </div>
  );
};

// ------ PROFILE PANEL COMPONENT ------
const ProfilePanel = ({ profile, user }: { profile: Profile, user: SupabaseUser }) => {
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [companyName, setCompanyName] = useState(profile.company_name || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        company_name: companyName,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      setMessage({type: 'error', text: error.message});
    } else {
      setMessage({type: 'success', text: 'Profile updated successfully!'});
    }
    setLoading(false);
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-200">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Edit Profile</h3>
      
      {message && (
        <div className={`p-4 rounded-lg mb-4 text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-lg">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-500"
          />
        </div>
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            id="companyName"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

// ------ ORDERS PANEL COMPONENT ------
const OrdersPanel = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, created_at, total_amount, currency,
          order_items ( service_name, quantity )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else if (data) {
        setOrders(data as Order[]);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-200">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">My Order History</h3>
      {loading ? (
        <p className="text-gray-500">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border border-gray-200 rounded-xl p-6">
              <div className="md:flex md:justify-between md:items-center mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Order #{order.id}</h4>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-xl font-bold text-green-600 mt-2 md:mt-0">
                  {order.currency}{order.total_amount.toFixed(2)}
                </div>
              </div>
              <ul className="space-y-2 border-t border-gray-200 pt-4">
                {order.order_items.map((item, index) => (
                  <li key={index} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.quantity}x {item.service_name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountPage;

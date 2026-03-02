# Admin Dashboard Implementation Guide

## Overview
Create a comprehensive admin dashboard for managing all aspects of the Superfly Commerce website, including orders, contacts, verifications, and analytics.

## Current Status
- ✅ Frontend admin components referenced
- ✅ Admin functionality outlined in code
- ❌ No admin authentication system
- ❌ No admin dashboard interface
- ❌ No admin API endpoints

## Required Admin Features

### 1. Authentication & Security
- Secure admin login system
- Role-based access control
- Session management
- Two-factor authentication (optional)

### 2. Dashboard Overview
- Key metrics and KPIs
- Recent activity feed
- Quick actions
- System health status

### 3. Contact Management
- View all contact form submissions
- Respond to inquiries
- Track follow-up status
- Export contact data

### 4. Order Management
- View all orders and payments
- Track order status
- Process refunds
- Generate invoices

### 5. Sustainability Verification
- Review verification requests
- Approve/reject applications
- Manage verified client list
- Document management

### 6. Content Management
- Update service catalog
- Manage pricing
- Edit website content
- Newsletter management

## Implementation Guide

### 1. Admin Authentication System

#### Database Schema
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Authentication Middleware
```javascript
// middleware/adminAuth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await db.admin_users.findByPk(decoded.adminId);
    
    if (!admin || !admin.is_active) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await db.admin_users.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    await admin.update({ last_login: new Date() });
    
    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = { authenticateAdmin };
```

### 2. Dashboard Overview API

#### Dashboard Stats
```javascript
// GET /api/admin/dashboard-stats
app.get('/api/admin/dashboard-stats', authenticateAdmin, async (req, res) => {
  try {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    
    // Get key metrics
    const stats = {
      // Contact stats
      totalContacts: await db.contacts.count(),
      newContactsThisMonth: await db.contacts.count({
        where: { created_at: { [Op.gte]: thisMonth } }
      }),
      
      // Order stats
      totalOrders: await db.orders.count(),
      totalRevenue: await db.orders.sum('total_amount', {
        where: { status: 'completed' }
      }),
      revenueThisMonth: await db.orders.sum('total_amount', {
        where: { 
          status: 'completed',
          created_at: { [Op.gte]: thisMonth }
        }
      }),
      
      // Verification stats
      pendingVerifications: await db.sustainability_verifications.count({
        where: { status: 'pending' }
      }),
      
      // Newsletter stats
      newsletterSubscribers: await db.newsletter.count({
        where: { status: 'active' }
      })
    };
    
    // Calculate growth rates
    const lastMonthRevenue = await db.orders.sum('total_amount', {
      where: { 
        status: 'completed',
        created_at: { 
          [Op.gte]: lastMonth,
          [Op.lt]: thisMonth
        }
      }
    });
    
    stats.revenueGrowth = lastMonthRevenue ? 
      ((stats.revenueThisMonth - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1) : 0;
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});
```

#### Recent Activity Feed
```javascript
// GET /api/admin/recent-activity
app.get('/api/admin/recent-activity', authenticateAdmin, async (req, res) => {
  try {
    const activities = [];
    
    // Recent contacts
    const recentContacts = await db.contacts.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'name', 'email', 'service', 'created_at']
    });
    
    recentContacts.forEach(contact => {
      activities.push({
        type: 'contact',
        title: `New contact from ${contact.name}`,
        description: `Interested in ${contact.service}`,
        timestamp: contact.created_at,
        data: contact
      });
    });
    
    // Recent orders
    const recentOrders = await db.orders.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'customer_name', 'total_amount', 'status', 'created_at']
    });
    
    recentOrders.forEach(order => {
      activities.push({
        type: 'order',
        title: `New order from ${order.customer_name}`,
        description: `£${order.total_amount} - ${order.status}`,
        timestamp: order.created_at,
        data: order
      });
    });
    
    // Sort by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json(activities.slice(0, 10));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});
```

### 3. Contact Management

#### Contact List API
```javascript
// GET /api/admin/contacts
app.get('/api/admin/contacts', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, service, search } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    
    if (status) where.status = status;
    if (service) where.service = service;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { company: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const { count, rows } = await db.contacts.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      contacts: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// PUT /api/admin/contacts/:id
app.put('/api/admin/contacts/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, followUpDate } = req.body;
    
    await db.contacts.update({
      status,
      admin_notes: notes,
      follow_up_date: followUpDate,
      updated_at: new Date()
    }, {
      where: { id }
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
});
```

### 4. Order Management

#### Order List API
```javascript
// GET /api/admin/orders
app.get('/api/admin/orders', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, dateFrom, dateTo } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    
    if (status) where.status = status;
    if (dateFrom || dateTo) {
      where.created_at = {};
      if (dateFrom) where.created_at[Op.gte] = new Date(dateFrom);
      if (dateTo) where.created_at[Op.lte] = new Date(dateTo);
    }
    
    const { count, rows } = await db.orders.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      orders: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/admin/orders/:id
app.get('/api/admin/orders/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await db.orders.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});
```

### 5. Sustainability Verification Management

#### Verification List API
```javascript
// GET /api/admin/verifications
app.get('/api/admin/verifications', authenticateAdmin, async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    
    const verifications = await db.sustainability_verifications.findAll({
      where: { status },
      include: [{
        model: db.verification_documents,
        as: 'documents'
      }],
      order: [['created_at', 'DESC']]
    });
    
    res.json(verifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch verifications' });
  }
});

// PUT /api/admin/verifications/:id/approve
app.put('/api/admin/verifications/:id/approve', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedLevel, notes } = req.body;
    
    // Update verification
    await db.sustainability_verifications.update({
      status: 'approved',
      approved_level: approvedLevel,
      admin_notes: notes,
      reviewed_by: req.admin.email,
      reviewed_at: new Date()
    }, {
      where: { id }
    });
    
    // Add to verified clients
    const verification = await db.sustainability_verifications.findByPk(id);
    await db.verified_clients.upsert({
      email: verification.email,
      level: approvedLevel,
      verified_date: new Date(),
      notes: notes
    });
    
    // Send approval email
    await emailService.sendVerificationApproved(verification, approvedLevel);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve verification' });
  }
});
```

### 6. Frontend Admin Dashboard

#### Admin Dashboard Component
```javascript
// components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Users, DollarSign, FileText, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        fetch('/api/admin/dashboard-stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        }),
        fetch('/api/admin/recent-activity', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        })
      ]);

      const statsData = await statsRes.json();
      const activityData = await activityRes.json();

      setStats(statsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          change={`+${stats.newContactsThisMonth} this month`}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Revenue"
          value={`£${stats.totalRevenue?.toLocaleString() || 0}`}
          change={`${stats.revenueGrowth}% growth`}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Pending Verifications"
          value={stats.pendingVerifications}
          change="Requires review"
          icon={FileText}
          color="bg-yellow-500"
        />
        <StatCard
          title="Newsletter Subscribers"
          value={stats.newsletterSubscribers}
          change="Active subscribers"
          icon={TrendingUp}
          color="bg-purple-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{activity.title}</h3>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                activity.type === 'contact' ? 'bg-blue-100 text-blue-800' :
                activity.type === 'order' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {activity.type}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`${color} p-3 rounded-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{change}</p>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
```

### 7. Admin Routes Setup

#### Admin Router
```javascript
// routes/admin.js
const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/adminAuth');

// Apply authentication to all admin routes
router.use(authenticateAdmin);

// Dashboard
router.get('/dashboard-stats', require('../controllers/admin/dashboard').getStats);
router.get('/recent-activity', require('../controllers/admin/dashboard').getRecentActivity);

// Contacts
router.get('/contacts', require('../controllers/admin/contacts').getContacts);
router.get('/contacts/:id', require('../controllers/admin/contacts').getContact);
router.put('/contacts/:id', require('../controllers/admin/contacts').updateContact);

// Orders
router.get('/orders', require('../controllers/admin/orders').getOrders);
router.get('/orders/:id', require('../controllers/admin/orders').getOrder);
router.put('/orders/:id/status', require('../controllers/admin/orders').updateOrderStatus);

// Verifications
router.get('/verifications', require('../controllers/admin/verifications').getVerifications);
router.put('/verifications/:id/approve', require('../controllers/admin/verifications').approveVerification);
router.put('/verifications/:id/reject', require('../controllers/admin/verifications').rejectVerification);

module.exports = router;
```

## Implementation Checklist
- [ ] Set up admin authentication system
- [ ] Create admin database schema
- [ ] Build dashboard overview API
- [ ] Implement contact management
- [ ] Create order management system
- [ ] Build verification review system
- [ ] Design admin dashboard frontend
- [ ] Set up admin routing
- [ ] Add role-based permissions
- [ ] Implement audit logging
- [ ] Test all admin functionality
- [ ] Set up admin user creation process
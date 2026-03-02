# Sustainability Verification System Guide

## Overview
Implement the complete sustainability verification workflow, including document upload, admin review, and discount level management.

## Current Status
- ✅ Verification UI components built
- ✅ File upload interface created
- ✅ Discount level calculations
- ❌ No file storage backend
- ❌ No admin review system
- ❌ No verification workflow

## Required Implementation

### 1. File Upload System

#### Backend API for File Upload
```javascript
// POST /api/upload-verification
const multer = require('multer');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

app.post('/api/upload-verification', upload.array('documents', 10), async (req, res) => {
  try {
    const { name, email, company, phone, targetLevel } = req.body;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    // Create verification request
    const verification = await db.sustainability_verifications.create({
      name,
      email,
      company,
      phone,
      target_level: parseInt(targetLevel),
      status: 'pending',
      created_at: new Date()
    });
    
    // Upload files to S3
    const uploadedFiles = [];
    for (const file of files) {
      const key = `verifications/${verification.id}/${Date.now()}-${file.originalname}`;
      
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ServerSideEncryption: 'AES256'
      };
      
      const result = await s3.upload(uploadParams).promise();
      
      uploadedFiles.push({
        filename: file.originalname,
        s3_key: key,
        url: result.Location,
        size: file.size,
        mimetype: file.mimetype
      });
      
      // Save file record
      await db.verification_documents.create({
        verification_id: verification.id,
        filename: file.originalname,
        s3_key: key,
        file_size: file.size,
        mimetype: file.mimetype,
        uploaded_at: new Date()
      });
    }
    
    // Send notification emails
    await sendVerificationSubmittedEmail(verification, uploadedFiles);
    await sendAdminVerificationNotification(verification, uploadedFiles);
    
    res.json({ 
      success: true, 
      verificationId: verification.id,
      filesUploaded: uploadedFiles.length 
    });
    
  } catch (error) {
    console.error('Verification upload error:', error);
    res.status(500).json({ error: 'Failed to submit verification' });
  }
});
```

### 2. Database Schema
```sql
CREATE TABLE sustainability_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(50),
  target_level INTEGER NOT NULL,
  approved_level INTEGER,
  status VARCHAR(50) DEFAULT 'pending', -- pending, under_review, approved, rejected
  admin_notes TEXT,
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE verification_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id UUID REFERENCES sustainability_verifications(id),
  filename VARCHAR(255) NOT NULL,
  s3_key VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mimetype VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE verified_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  level INTEGER NOT NULL,
  verified_date TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  expires_at TIMESTAMP
);
```

### 3. Admin Review System

#### Admin Dashboard API
```javascript
// GET /api/admin/verifications
app.get('/api/admin/verifications', authenticateAdmin, async (req, res) => {
  try {
    const verifications = await db.sustainability_verifications.findAll({
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
    
    // Update verification status
    await db.sustainability_verifications.update({
      status: 'approved',
      approved_level: approvedLevel,
      admin_notes: notes,
      reviewed_by: req.admin.email,
      reviewed_at: new Date(),
      updated_at: new Date()
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
    await sendVerificationApprovedEmail(verification, approvedLevel);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve verification' });
  }
});
```

### 4. Frontend Integration

#### Update SustainabilityVerification Component
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    const formData = new FormData();
    formData.append('name', contactInfo.name);
    formData.append('email', contactInfo.email);
    formData.append('company', contactInfo.company);
    formData.append('phone', contactInfo.phone);
    formData.append('targetLevel', selectedLevel.level);
    
    uploadedFiles.forEach((file) => {
      formData.append('documents', file);
    });
    
    const response = await fetch('/api/upload-verification', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      const result = await response.json();
      alert(`Verification submitted successfully! We'll review your documents within 2-3 business days. Reference ID: ${result.verificationId}`);
      onVerificationComplete(true);
      onClose();
    } else {
      throw new Error('Failed to submit verification');
    }
  } catch (error) {
    alert('Failed to submit verification. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
```

### 5. Email Templates

#### Verification Submitted Confirmation
```javascript
const sendVerificationSubmittedEmail = async (verification, files) => {
  const subject = `Sustainability Verification Submitted - Level ${verification.target_level}`;
  
  const htmlContent = `
    <h2>Verification Submitted Successfully!</h2>
    <p>Hi ${verification.name},</p>
    <p>We've received your sustainability verification request for Level ${verification.target_level}.</p>
    
    <h3>What happens next:</h3>
    <ol>
      <li>Our team will review your documentation within 2-3 business days</li>
      <li>We may contact you if additional information is needed</li>
      <li>You'll receive an email with the verification result</li>
      <li>If approved, your discount will be automatically applied to future orders</li>
    </ol>
    
    <h3>Documents submitted:</h3>
    <ul>
      ${files.map(file => `<li>${file.filename} (${(file.size / 1024 / 1024).toFixed(2)} MB)</li>`).join('')}
    </ul>
    
    <p><strong>Reference ID:</strong> ${verification.id}</p>
    
    <p>Thank you for your commitment to sustainability!</p>
    <p>The Superfly Commerce Team</p>
  `;
  
  await sendEmail({
    to: verification.email,
    subject,
    html: htmlContent
  });
};
```

#### Admin Notification
```javascript
const sendAdminVerificationNotification = async (verification, files) => {
  const subject = `🌱 New Sustainability Verification - Level ${verification.target_level}`;
  
  const htmlContent = `
    <h2>New Sustainability Verification Request</h2>
    <p><strong>Name:</strong> ${verification.name}</p>
    <p><strong>Email:</strong> ${verification.email}</p>
    <p><strong>Company:</strong> ${verification.company}</p>
    <p><strong>Target Level:</strong> ${verification.target_level}</p>
    <p><strong>Documents:</strong> ${files.length} files uploaded</p>
    
    <h3>Files:</h3>
    <ul>
      ${files.map(file => `<li>${file.filename} (${(file.size / 1024 / 1024).toFixed(2)} MB)</li>`).join('')}
    </ul>
    
    <p><a href="${process.env.ADMIN_URL}/verifications/${verification.id}">Review in Admin Dashboard</a></p>
  `;
  
  await sendEmail({
    to: 'harry@superflycommerce.com',
    subject,
    html: htmlContent
  });
};
```

### 6. Client Verification Check
```javascript
// Update verifiedClients.ts to check database
export const getVerifiedLevel = async (email: string): Promise<number> => {
  try {
    const response = await fetch(`/api/verified-level?email=${encodeURIComponent(email)}`);
    if (response.ok) {
      const data = await response.json();
      return data.level || 1;
    }
  } catch (error) {
    console.error('Error checking verified level:', error);
  }
  return 1; // Default to level 1
};

// API endpoint
app.get('/api/verified-level', async (req, res) => {
  try {
    const { email } = req.query;
    const client = await db.verified_clients.findOne({ 
      where: { email: email.toLowerCase() } 
    });
    
    res.json({ 
      level: client ? client.level : 1,
      verified: !!client 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check verification status' });
  }
});
```

## Implementation Checklist
- [ ] Set up AWS S3 bucket for file storage
- [ ] Create database schema for verifications
- [ ] Implement file upload API with validation
- [ ] Build admin review dashboard
- [ ] Create email templates for workflow
- [ ] Update frontend verification component
- [ ] Implement verified client checking system
- [ ] Add security measures (file scanning, access control)
- [ ] Test complete verification workflow
- [ ] Set up monitoring and logging
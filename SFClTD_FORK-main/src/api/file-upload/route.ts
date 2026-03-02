import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../../lib/supabaseAdmin.js';
import multer from 'multer';

const router = Router();

// Configure multer to use memory storage
// This holds the file in a buffer instead of saving it to disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const BUCKET_NAME = 'contracts'; // The name of your Supabase storage bucket

/**
 * @route POST /api/file-upload/upload-contract
 * @desc Uploads a single contract file to Supabase Storage.
 * @access Private (you'd add auth middleware here)
 *
 * @body {form-data} contractFile - The file to upload.
 */
router.post('/upload-contract', upload.single('contractFile'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided.' });
  }

  try {
    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    // Create a unique file path
    const filePath = `contracts/${Date.now()}.${fileExt}`;
// ... inside the router.post ...

    // 1. Upload using Admin client
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // 2. Get URL using Admin client
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    if (!urlData.publicUrl) {
      return res.status(500).json({ error: 'Could not get public URL for the file.' });
    }

    // Return the public URL and the path (to store in your DB)
    res.status(200).json({
      message: 'File uploaded successfully.',
      path: filePath,
      publicUrl: urlData.publicUrl,
    });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    console.error('File upload error:', errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});

export default router

import { Router, Request, Response } from 'express';
import { sendContractForSignature } from '../../lib/docusign.js';
import { supabaseAdmin } from '../../lib/supabaseAdmin.js'; // Import Admin client

const router = Router();

router.post('/send-signature-request', async (req: Request, res: Response) => {
  const { signerEmail, signerName, contractPath, contractName } = req.body;

  if (!signerEmail || !signerName || !contractPath) {
    return res.status(400).json({ error: 'Missing required fields: signerEmail, signerName, and contractPath.' });
  }

  try {
    console.log(`Downloading file from Supabase: ${contractPath}`);

    // 1. Download file directly using Admin client (Bypasses RLS/Public settings)
    const { data, error } = await supabaseAdmin.storage
      .from('contracts') // Ensure this matches your bucket name
      .download(contractPath);

    if (error || !data) {
      throw new Error(`Failed to download contract: ${error?.message || 'Unknown error'}`);
    }

    // 2. Convert Blob/File to Buffer
    const arrayBuffer = await data.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // 3. Send Buffer to DocuSign
    const result = await sendContractForSignature(
      signerEmail,
      signerName,
      fileBuffer, // Pass the buffer, not the URL
      contractName
    );

    res.status(200).json({
      message: 'Signature request sent successfully.',
      envelopeId: result.envelopeId,
    });

  } catch (err: any) {
    console.error('Send signature error:', err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;


import docusign from 'docusign-esign';
import axios from 'axios';

// Define required scopes
const SCOPES = ['signature', 'impersonation'];

/**
 * Generates a JWT token for Docusign authentication
 */
const getAccessToken = async (dsApiClient: docusign.ApiClient) => {
  const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
  const userId = process.env.DOCUSIGN_USER_ID;
  
  // Clean the private key
  const privateKey = process.env.DOCUSIGN_PRIVATE_KEY
    ? process.env.DOCUSIGN_PRIVATE_KEY.replace(/\\n/g, '\n')
    : '';

  if (!integrationKey || !userId || !privateKey) {
    throw new Error('Missing Docusign configuration (INTEGRATION_KEY, USER_ID, or PRIVATE_KEY).');
  }

  // --- FIX: DETECT ENVIRONMENT ---
  // If the Base Path is NOT demo, assume Production
  const basePath = process.env.DOCUSIGN_BASE_PATH || 'https://demo.docusign.net/restapi';
  const isProduction = !basePath.includes('demo.docusign.net');
  
  // Set the OAuth Base Path correctly (account-d.docusign.com for Demo, account.docusign.com for Prod)
  const oAuthBasePath = isProduction 
    ? 'account.docusign.com' 
    : 'account-d.docusign.com';

  dsApiClient.setOAuthBasePath(oAuthBasePath);
  // ------------------------------

  const results = await dsApiClient.requestJWTUserToken(
    integrationKey,
    userId,
    SCOPES,
    Buffer.from(privateKey, 'utf8'),
    3600
  );

  return results.body.access_token;
};

export const sendContractForSignature = async (
  signerEmail: string,
  signerName: string,
  fileBuffer: Buffer,
  contractName: string = 'Contract.pdf'
) => {
  const dsApiClient = new docusign.ApiClient();
  
  // Set the API Base Path (e.g., https://na2.docusign.net/restapi)
  dsApiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH || 'https://demo.docusign.net/restapi');

  // Authenticate (This will now use the correct OAuth server)
  const accessToken = await getAccessToken(dsApiClient);
  dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);

  // ... (Rest of the file stays the same as your previous working version)
  const documentBase64 = fileBuffer.toString('base64');

  const envelopeDefinition = new docusign.EnvelopeDefinition();
  envelopeDefinition.emailSubject = 'Please sign your Superfly Commerce Contract';
  envelopeDefinition.emailBlurb = 'Please sign the attached contract to get started.';

  const doc = new docusign.Document();
  doc.documentBase64 = documentBase64;
  doc.name = contractName;
  doc.fileExtension = contractName.split('.').pop() || 'pdf';
  doc.documentId = '1';

  envelopeDefinition.documents = [doc];

  const signer = new docusign.Signer();
  signer.email = signerEmail;
  signer.name = signerName;
  signer.recipientId = '1';
  signer.routingOrder = '1';

  const signHere = new docusign.SignHere();
  signHere.documentId = '1';
  signHere.pageNumber = '1';
  signHere.recipientId = '1';
  signHere.tabLabel = 'SignHereTab';
  signHere.xPosition = '100';
  signHere.yPosition = '150';

  const tabs = new docusign.Tabs();
  tabs.signHereTabs = [signHere];
  signer.tabs = tabs;

  const recipients = new docusign.Recipients();
  recipients.signers = [signer];
  envelopeDefinition.recipients = recipients;

  envelopeDefinition.status = 'sent';

  const envelopesApi = new docusign.EnvelopesApi(dsApiClient);
  const results = await envelopesApi.createEnvelope(process.env.DOCUSIGN_ACCOUNT_ID!, {
    envelopeDefinition,
  });

  return results;
};

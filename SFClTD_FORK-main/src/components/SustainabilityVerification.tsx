import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import { useLanguage } from '../lib/languageContext';

interface SustainabilityVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLevel: {
    level: number;
    name: string;
    discount: number;
    requirements: string[];
  };
  onVerificationComplete: (verified: boolean) => void;
}

const SustainabilityVerification: React.FC<SustainabilityVerificationProps> = ({
  isOpen,
  onClose,
  selectedLevel,
  onVerificationComplete
}) => {
  const { t } = useLanguage();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    company: '',
    phone: ''
  });

  const requiredDocuments = {
    2: [ // Conscious Brand
      'Sustainable packaging certification or photos',
      'Ethical sourcing policy document',
      'Carbon footprint tracking report or tool screenshots'
    ],
    3: [ // Impact Leader
      'B-Corp certification or equivalent sustainability certification',
      'Regenerative practices documentation',
      'Supply chain transparency report',
      'Community impact program documentation'
    ],
    4: [ // Planet Champion
      'Carbon negative operations certification',
      'Circular economy model documentation',
      'Fair trade certification',
      'Biodiversity restoration project evidence'
    ]
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactInfo.name || !contactInfo.email || uploadedFiles.length === 0) {
      alert('Please fill in all required fields and upload at least one document.');
      return;
    }

    setIsSubmitting(true);

    // Create email with verification request
    const subject = `🌱 Sustainability Verification Request - ${selectedLevel.name} (${selectedLevel.discount}% Discount)`;
    
    const fileList = uploadedFiles.map((file, index) => 
      `${index + 1}. ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
    ).join('\n');

    const requiredDocs = requiredDocuments[selectedLevel.level as keyof typeof requiredDocuments] || [];
    const requiredDocsList = requiredDocs.map((doc, index) => 
      `${index + 1}. ${doc}`
    ).join('\n');

    const body = `Hi Superfly Commerce Team,

I'm requesting verification for the ${selectedLevel.name} sustainability level to qualify for ${selectedLevel.discount}% discount on your services.

📋 CONTACT INFORMATION:
- Name: ${contactInfo.name}
- Email: ${contactInfo.email}
- Company: ${contactInfo.company || 'Not provided'}
- Phone: ${contactInfo.phone || 'Not provided'}

🌱 SUSTAINABILITY LEVEL REQUESTED:
- Level: ${selectedLevel.name}
- Discount: ${selectedLevel.discount}%

📄 REQUIRED DOCUMENTATION:
${requiredDocsList}

📎 UPLOADED FILES (${uploadedFiles.length} files):
${fileList}

Please review my documentation and verify my sustainability level. I understand that:
- Verification may take 2-3 business days
- Additional documentation may be requested
- Approval is subject to your sustainability criteria
- The discount applies to all future services once verified

I'm excited to work with a marketing agency that values sustainability and ethical business practices!

Best regards,
${contactInfo.name}

---
Note: Please find the attached documentation files. If you need any additional information or clarification, please don't hesitate to contact me.`;

    // Simulate file attachment process (in real implementation, files would be uploaded to cloud storage)
    setTimeout(() => {
      window.location.href = `mailto:harry@superflycommerce.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      setIsSubmitting(false);
      onVerificationComplete(true);
      onClose();
      
      // Show success message
      alert(`Verification request sent! Please attach your ${uploadedFiles.length} uploaded files to the email before sending. We'll review your documentation within 2-3 business days.`);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t.sustainabilityVerification}
            </h2>
            <p className="text-gray-600">
              {t.uploadSustainabilityDocs} <strong>{selectedLevel.name}</strong> {t.discountLevel} ({selectedLevel.discount}% off).
            </p>
          </div>

          {/* Level Info */}
          <div className="bg-green-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center mb-4">
              <Info className="w-6 h-6 text-green-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">
                {selectedLevel.name} - {selectedLevel.discount}% Discount
              </h3>
            </div>
            
            <h4 className="font-semibold text-gray-900 mb-3">{t.requiredDocumentation}</h4>
            <ul className="space-y-2">
              {(requiredDocuments[selectedLevel.level as keyof typeof requiredDocuments] || []).map((req, idx) => (
                <li key={idx} className="flex items-start text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t.contactInformation}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.fullName}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={contactInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder={t.yourFullName}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.emailAddress}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={contactInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder={t.yourEmail}
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.companyName}
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={contactInfo.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder={t.yourCompanyName}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.phoneNumber}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={contactInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder={t.phoneNumberPlaceholder}
                  />
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t.uploadDocumentation}</h3>
              
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-green-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  {t.dragDropFiles}
                </p>
                <p className="text-gray-600 mb-4">
                  {t.acceptedFormats}
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold cursor-pointer"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  {t.chooseFiles}
                </label>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {t.uploadedFiles} ({uploadedFiles.length})
                  </h4>
                  <div className="space-y-3">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 rounded-xl p-4"
                      >
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-green-500 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-600">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                {t.cancel}
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || uploadedFiles.length === 0}
                className="flex items-center px-8 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    {t.submitting}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {t.submitForVerification}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Verification Process Info */}
          <div className="mt-8 bg-blue-50 rounded-2xl p-6">
            <h4 className="font-semibold text-gray-900 mb-3">{t.verificationProcess}</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>{t.reviewDocumentation}</p>
              <p>{t.requestAdditional}</p>
              <p>{t.discountApplied}</p>
              <p>{t.emailConfirmation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityVerification;
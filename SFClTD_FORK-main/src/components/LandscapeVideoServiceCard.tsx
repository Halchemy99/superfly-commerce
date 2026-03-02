import React, { useState } from 'react';
import { Video } from 'lucide-react';

interface LandscapeVideoServiceCardProps {
  sustainabilityLevel: number;
  availableLevels: number[];
  sustainabilityLevels: Array<{
    level: number;
    name: string;
    discount: number;
  }>;
  faces: string[];
  onGetQuote: (serviceId: string, serviceName: string) => void;
  onAddToCart: (serviceId: string, serviceName: string) => void;
}

const LandscapeVideoServiceCard: React.FC<LandscapeVideoServiceCardProps> = ({
  sustainabilityLevel,
  availableLevels,
  sustainabilityLevels,
  faces,
  onGetQuote,
  onAddToCart
}) => {
  const [selectedDuration, setSelectedDuration] = useState('landscape-video-30');

  const durations = [
    { id: 'landscape-video-15', duration: '15 seconds', price: 200 },
    { id: 'landscape-video-30', duration: '30 seconds', price: 400 },
    { id: 'landscape-video-45', duration: '45 seconds', price: 500 }
  ];

  const selectedOption = durations.find(d => d.id === selectedDuration) || durations[1];

  const calculatePrice = (basePrice: number, sustainabilityDiscount: number = 0) => {
    const discountAmount = (basePrice * sustainabilityDiscount) / 100;
    return basePrice - discountAmount;
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-blue-200 hover:border-blue-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900">
              Landscape Video Production
            </h4>
            <div className="text-xs text-blue-600 capitalize">
              Animation/Graphics/Raw Footage
            </div>
          </div>
        </div>
      </div>
      
      {/* Specialist Faces */}
      <div className="flex items-center mb-4">
        <div className="flex -space-x-2 mr-3">
          {faces.slice(0, 3).map((face, idx) => (
            <img
              key={idx}
              src={face}
              alt={`Video Specialist ${idx + 1}`}
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
          ))}
        </div>
        <span className="text-xs text-gray-600 font-medium">
          Video production specialists
        </span>
      </div>
      
      {/* Duration Options */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Duration & Pricing:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {durations.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedDuration(option.id)}
              className={`p-3 border-2 rounded-xl transition-all duration-300 text-center ${
                selectedDuration === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="font-medium text-gray-900 text-sm mb-1">{option.duration}</div>
              <div className="text-lg font-bold text-blue-500">
                £{Math.round(calculatePrice(option.price, sustainabilityLevels[sustainabilityLevel - 1].discount))}
              </div>
              {sustainabilityLevels[sustainabilityLevel - 1].discount > 0 && availableLevels.includes(sustainabilityLevel) && (
                <div className="text-xs text-gray-500 line-through">
                  £{option.price}
                </div>
              )}
            </button>
          ))}
        </div>
        
        <div className="mt-3 text-center">
          <div className="text-lg font-bold text-blue-600">
            Selected: {selectedOption.duration} - £{Math.round(calculatePrice(selectedOption.price, sustainabilityLevels[sustainabilityLevel - 1].discount))}
          </div>
          {sustainabilityLevels[sustainabilityLevel - 1].discount > 0 && availableLevels.includes(sustainabilityLevel) && (
            <div className="text-sm text-green-600">
              Save £{Math.round(selectedOption.price - calculatePrice(selectedOption.price, sustainabilityLevels[sustainabilityLevel - 1].discount))} with sustainability discount
            </div>
          )}
        </div>
      </div>
      
      <button 
        onClick={() => onAddToCart(selectedDuration, `Landscape Video - ${selectedOption.duration}`)}
        className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold"
      >
        <span className="mr-2">+</span>
        Add to Cart
      </button>
      
      <p className="text-xs text-gray-500 text-center mt-3">
        Fair specialist pay • Animation/Graphics/Raw footage
      </p>
    </div>
  );
};

export default LandscapeVideoServiceCard;
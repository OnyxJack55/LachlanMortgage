import React, { useState } from 'react';
import ConfigForm from '../components/ConfigForm';
import { SiteConfig, defaultConfig } from '../config/siteConfig';

const ConfigPage: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    setIsSaved(true);
    
    // Save to localStorage
    localStorage.setItem('siteConfig', JSON.stringify(newConfig));
    
    // Reset saved message after 3 seconds
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Configuration</h1>
            <p className="text-gray-600">
              Customize your website content and settings below. Changes will be saved automatically.
            </p>
          </div>

          {isSaved && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg animate-fade-in-up">
              Configuration saved successfully!
            </div>
          )}

          <ConfigForm onSave={handleSave} initialConfig={config} />
        </div>
      </div>
    </div>
  );
};

export default ConfigPage; 
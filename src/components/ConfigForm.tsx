import React, { useState } from 'react';
import { SiteConfig, defaultConfig } from '../config/siteConfig';

interface ConfigFormProps {
  onSave: (config: SiteConfig) => void;
  initialConfig?: SiteConfig;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ 
  onSave, 
  initialConfig = defaultConfig 
}) => {
  const [config, setConfig] = useState<SiteConfig>(initialConfig);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
  };

  const handleChange = (
    section: keyof SiteConfig,
    field: string,
    value: string | Array<any>
  ) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayItemChange = (
    section: 'services' | 'testimonials',
    index: number,
    field: string,
    value: string
  ) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        items: prev[section].items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Business Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Business Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Name</label>
            <input
              type="text"
              value={config.business.name}
              onChange={(e) => handleChange('business', 'name', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={config.business.location}
              onChange={(e) => handleChange('business', 'location', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={config.business.email}
              onChange={(e) => handleChange('business', 'email', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={config.business.phone}
              onChange={(e) => handleChange('business', 'phone', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">About Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={config.about.title}
              onChange={(e) => handleChange('about', 'title', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={config.about.content}
              onChange={(e) => handleChange('about', 'content', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mission</label>
              <input
                type="text"
                value={config.about.mission}
                onChange={(e) => handleChange('about', 'mission', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vision</label>
              <input
                type="text"
                value={config.about.vision}
                onChange={(e) => handleChange('about', 'vision', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Services Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Section Title</label>
            <input
              type="text"
              value={config.services.title}
              onChange={(e) => handleChange('services', 'title', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {config.services.items.map((service, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Service {index + 1}</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => handleArrayItemChange('services', index, 'title', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={service.description}
                    onChange={(e) => handleArrayItemChange('services', index, 'description', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Testimonials Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Section Title</label>
            <input
              type="text"
              value={config.testimonials.title}
              onChange={(e) => handleChange('testimonials', 'title', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {config.testimonials.items.map((testimonial, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Testimonial {index + 1}</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quote</label>
                  <textarea
                    value={testimonial.quote}
                    onChange={(e) => handleArrayItemChange('testimonials', index, 'quote', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={testimonial.name}
                      onChange={(e) => handleArrayItemChange('testimonials', index, 'name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <input
                      type="text"
                      value={testimonial.role}
                      onChange={(e) => handleArrayItemChange('testimonials', index, 'role', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Configuration
        </button>
      </div>
    </form>
  );
};

export default ConfigForm; 
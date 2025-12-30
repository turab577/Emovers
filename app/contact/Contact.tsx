'use client'
import React, { useState } from 'react';
import PrimaryBtn from '../ui/buttons/PrimaryBtn';

export default function Contact() {
  // Initial state for contact information
  const [contactInfo, setContactInfo] = useState([
    { id: 1, type: 'phone', value: '+1 (555) 123-4567', placeholder: 'Phone number' },
    { id: 2, type: 'email', value: 'contact@example.com', placeholder: 'Email address' },
    { id: 3, type: 'whatsapp', value: '+1 (555) 987-6543', placeholder: 'WhatsApp number' }
  ]);

  // Initial state for locations
  const [locations, setLocations] = useState([
    { id: 1, value: 'New York Office: 123 Main St, NY 10001', placeholder: 'Location details' },
    { id: 2, value: 'London Office: 456 Oxford St, W1D 1AB', placeholder: 'Location details' }
  ]);

  // Initial state for socials
  const [socials, setSocials] = useState([
    { id: 1, type: 'twitter', value: '@companyname', placeholder: 'Twitter handle' },
    { id: 2, type: 'linkedin', value: 'company-name', placeholder: 'LinkedIn profile' },
    { id: 3, type: 'instagram', value: '@company_insta', placeholder: 'Instagram handle' }
  ]);

  // Edit states for each section
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingLocations, setIsEditingLocations] = useState(false);
  const [isEditingSocials, setIsEditingSocials] = useState(false);

  // Handle input change for contact info
  const handleContactChange = (id : any, newValue : any) => {
    setContactInfo(contactInfo.map(item => 
      item.id === id ? { ...item, value: newValue } : item
    ));
  };

  // Handle input change for locations
  const handleLocationChange = (id : any, newValue : any)  => {
    setLocations(locations.map(item => 
      item.id === id ? { ...item, value: newValue } : item
    ));
  };

  // Handle input change for socials
  const handleSocialChange = (id : any, newValue : any)  => {
    setSocials(socials.map(item => 
      item.id === id ? { ...item, value: newValue } : item
    ));
  };

  // Add new contact field
  const addContactField = () => {
    const newId = contactInfo.length > 0 ? Math.max(...contactInfo.map(c => c.id)) + 1 : 1;
    setContactInfo([
      ...contactInfo,
      { id: newId, type: 'other', value: '', placeholder: 'New contact information' }
    ]);
    setIsEditingContact(true);
  };

  // Add new location
  const addLocation = () => {
    const newId = locations.length > 0 ? Math.max(...locations.map(l => l.id)) + 1 : 1;
    setLocations([
      ...locations,
      { id: newId, value: '', placeholder: 'New location details' }
    ]);
    setIsEditingLocations(true);
  };

  // Add new social
  const addSocial = () => {
    const newId = socials.length > 0 ? Math.max(...socials.map(s => s.id)) + 1 : 1;
    setSocials([
      ...socials,
      { id: newId, type: 'other', value: '', placeholder: 'New social media' }
    ]);
    setIsEditingSocials(true);
  };

  // Remove field from any section
  const removeField = (section : any, id : any) => {
    if (section === 'contact') {
      if (contactInfo.length <= 1) return; // Keep at least one
      setContactInfo(contactInfo.filter(item => item.id !== id));
    } else if (section === 'location') {
      if (locations.length <= 1) return; // Keep at least one
      setLocations(locations.filter(item => item.id !== id));
    } else if (section === 'social') {
      if (socials.length <= 1) return; // Keep at least one
      setSocials(socials.filter(item => item.id !== id));
    }
  };

  // Get icon for contact type
  const getContactIcon = (type : any) => {
    switch(type) {
      case 'phone': return '📞';
      case 'email': return '✉️';
      case 'whatsapp': return '💬';
      default: return '📋';
    }
  };

  // Get icon for social type
  const getSocialIcon = (type : any) => {
    switch(type) {
      case 'twitter': return '🐦';
      case 'linkedin': return '💼';
      case 'instagram': return '📷';
      case 'facebook': return '👍';
      default: return '🔗';
    }
  };

  return (
    <div className="mx-auto">
      {/* Contact Section */}
      <section className="mb-10 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Contact</h2>
          <div className="flex gap-2">
            {isEditingContact ? (
              <>
                <PrimaryBtn
                  label="Save"
                  onClick={() => setIsEditingContact(false)}
                />
                <button 
                  onClick={() => setIsEditingContact(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <PrimaryBtn
                label="Edit"
                onClick={() => setIsEditingContact(true)}
              />
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          {contactInfo.map((contact) => (
            <div key={contact.id} className="flex items-center gap-4">
              <span className="text-xl">{getContactIcon(contact.type)}</span>
              {isEditingContact ? (
                <div className="flex-1 flex-col sm:flex-row flex gap-2">
                  <input
                    type="text"
                    value={contact.value}
                    onChange={(e) => handleContactChange(contact.id, e.target.value)}
                    placeholder={contact.placeholder}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={() => removeField('contact', contact.id)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                    disabled={contactInfo.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <span className="text-gray-700">{contact.value || `[Add ${contact.type}]`}</span>
              )}
            </div>
          ))}
        </div>
        
        {isEditingContact && (
          <button 
            onClick={addContactField}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
          >
            + Add Contact Field
          </button>
        )}
      </section>

      {/* Locations Section */}
      <section className="mb-10 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Locations</h2>
          <div className="flex gap-2">
            {isEditingLocations ? (
              <>
                <PrimaryBtn
                  label="Save"
                  onClick={() => setIsEditingLocations(false)}
                />
                <button 
                  onClick={() => setIsEditingLocations(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <PrimaryBtn
                label="Edit"
                onClick={() => setIsEditingLocations(true)}
              />
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          {locations.map((location) => (
            <div key={location.id} className="flex items-center gap-4">
              <span className="text-xl">📍</span>
              {isEditingLocations ? (
                <div className="flex-1 flex-col sm:flex-row flex gap-2">
                  <input
                    type="text"
                    value={location.value}
                    onChange={(e) => handleLocationChange(location.id, e.target.value)}
                    placeholder={location.placeholder}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={() => removeField('location', location.id)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                    disabled={locations.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <span className="text-gray-700">{location.value || '[Add location]'}</span>
              )}
            </div>
          ))}
        </div>
        
        {isEditingLocations && (
          <button 
            onClick={addLocation}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
          >
            + Add Location
          </button>
        )}
      </section>

      {/* Socials Section */}
      <section className="rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Socials</h2>
          <div className="flex gap-2">
            {isEditingSocials ? (
              <>
                <PrimaryBtn
                  label="Save"
                  onClick={() => setIsEditingSocials(false)}
                />
                <button 
                  onClick={() => setIsEditingSocials(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <PrimaryBtn
                label="Edit"
                onClick={() => setIsEditingSocials(true)}
              />
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          {socials.map((social) => (
            <div key={social.id} className="flex items-center gap-4">
              <span className="text-xl">{getSocialIcon(social.type)}</span>
              {isEditingSocials ? (
                <div className="flex-1 flex-col sm:flex-row flex gap-2">
                  <input
                    type="text"
                    value={social.value}
                    onChange={(e) => handleSocialChange(social.id, e.target.value)}
                    placeholder={social.placeholder}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={() => removeField('social', social.id)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                    disabled={socials.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <span className="text-gray-700">{social.value || `[Add ${social.type}]`}</span>
              )}
            </div>
          ))}
        </div>
        
        {isEditingSocials && (
          <button 
            onClick={addSocial}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
          >
            + Add Social Media
          </button>
        )}
      </section>
    </div>
  );
}
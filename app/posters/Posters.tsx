import React, { useState } from 'react'
import PrimaryBtn from '../ui/buttons/PrimaryBtn';

export default function Posters() {
  // Initial state with sample images
  const [images, setImages] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400&h=300&fit=crop' },
    { id: 2, url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop' },
    { id: 3, url: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=400&h=300&fit=crop' },
    { id: 4, url: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c?w=400&h=300&fit=crop' },
    { id: 5, url: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=400&h=300&fit=crop' },
    { id: 6, url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop' },
  ]);

  // Handle delete image
  const handleDelete = (id: number) => {
    setImages(images.filter(image => image.id !== id));
  };

  // Handle update image (replace with uploaded image)
  const handleUpdate = (id: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newUrl = event.target?.result as string;
          setImages(images.map(image => 
            image.id === id ? { ...image, url: newUrl } : image
          ));
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  return (
    <div>
      <div className='flex flex-col sm:flex-row mb-3 sm:mb-0 justify-between items  -center'>
      <div className='space-y-2 mb-8'>
        <h2 className='heading-2 text-[#111827] font-medium'>Posters</h2>
        <p className='heading-5 text-[#70747D] font-normal'>See and customize your posters</p>
      </div>
      <div>
       <PrimaryBtn
       label=' Upload New Posters'
       imageSrc='/images/arrow-right.svg'
       imagePosition='right'
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.multiple = true;
            
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files) {
                Array.from(files).forEach((file, index) => {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const newUrl = event.target?.result as string;
                    setImages(prev => [...prev, {
                      id: Date.now() + index,
                      url: newUrl
                    }]);
                  };
                  reader.readAsDataURL(file);
                });
              }
            };
            
            input.click();
          }}
        />
        </div>
      </div>

      {/* Upload Button */}
    

      {/* Responsive image grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <div 
            key={image.id} 
            className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
          >
            {/* Image Container - Fixed size with relative positioning */}
            <div className="relative w-full h-64 overflow-hidden">
              <img 
                src={image.url} 
                alt={`Poster ${image.id}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Hover Overlay - Dark overlay for button visibility */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Action Buttons - Positioned top-left within each image */}
              <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                {/* Update Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate(image.id);
                  }}
                  className="bg-white cursor-pointer hover:bg-gray-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 hover:scale-110"
                  title="Update image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(image.id);
                  }}
                  className="bg-white cursor-pointer hover:bg-gray-100 text-red-600 p-2 rounded-full shadow-lg transition-all duration-200 transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 hover:scale-110"
                  title="Delete image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No posters found</h3>
          <p className="mt-1 text-sm text-gray-500">Upload some images to get started</p>
        </div>
      )}
    </div>
  )
}
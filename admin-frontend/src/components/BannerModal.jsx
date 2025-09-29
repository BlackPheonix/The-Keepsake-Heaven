import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './BannerModal.css';

const BannerModal = ({ onClose, onSave, mode = 'add', banner }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'Active',
    imageUrl: null // This will store the Base64 string
  });

  useEffect(() => {
    console.log("🖼️ BannerModal mounted at 2025-08-07 20:42:58");
    console.log("👤 Current user: BlackPheonix");
    console.log("📋 Mode:", mode);
    console.log("📄 Banner data:", banner);
    
    if (mode === 'edit' && banner) {
      console.log("🔄 Loading existing banner data for editing");
      setForm({
        name: banner.name || '',
        description: banner.description || '',
        status: banner.status || 'Active',
        imageUrl: banner.imageUrl || null // Banner.imageUrl will be the Base64 string
      });
      console.log("✅ Form populated with existing banner data");
    } else {
      console.log("➕ Initializing form for new banner");
      setForm({
        name: '',
        description: '',
        status: 'Active',
        imageUrl: null
      });
    }
  }, [mode, banner]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`📝 Input changed - ${name}:`, value.length > 50 ? `${value.substring(0, 50)}...` : value);
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("📸 Image file selected at 2025-08-07 20:42:58:", file);
    
    if (file) {
      console.log("📸 File details:");
      console.log("  - Name:", file.name);
      console.log("  - Size:", file.size, "bytes");
      console.log("  - Type:", file.type);
      console.log("  - Last Modified:", new Date(file.lastModified).toISOString());
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error("❌ Invalid file type:", file.type);
        alert('Please select a valid image file');
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        console.error("❌ File too large:", file.size, "bytes");
        alert('Image file must be less than 5MB');
        e.target.value = ''; // Clear the input
        return;
      }
      
      console.log("📸 Starting Base64 conversion...");
      const reader = new FileReader();
      reader.onloadstart = () => {
        console.log("📸 FileReader started");
      };
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentLoaded = Math.round((e.loaded / e.total) * 100);
          console.log(`📸 FileReader progress: ${percentLoaded}%`);
        }
      };
      reader.onloadend = () => {
        console.log("📸 Base64 conversion completed at", new Date().toISOString());
        console.log("📸 Base64 length:", reader.result.length);
        console.log("📸 Base64 prefix:", reader.result.substring(0, 50));
        console.log("📸 Base64 data type:", reader.result.split(',')[0]);
        
        // Set the image as a Base64 string
        setForm(prev => ({ ...prev, imageUrl: reader.result }));
        console.log("✅ Image successfully converted to Base64 and stored in form");
      };
      reader.onerror = (error) => {
        console.error("💥 FileReader error:", error);
        alert('Error reading file. Please try again.');
      };
      reader.readAsDataURL(file);
    } else {
      console.log("📸 No file selected, clearing image");
      setForm(prev => ({ ...prev, imageUrl: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("💾 Form submission started at 2025-08-07 20:42:58");
    console.log("👤 Current user: BlackPheonix");
    console.log("📋 Current form data:", {
      name: form.name,
      description: form.description,
      status: form.status,
      hasImage: !!form.imageUrl,
      imageType: typeof form.imageUrl,
      isBase64: form.imageUrl?.startsWith('data:') ? 'Yes' : 'No',
      imageLength: form.imageUrl?.length || 0,
      imagePrefix: form.imageUrl ? form.imageUrl.substring(0, 50) : 'No image'
    });
    
    // Validate required fields
    if (!form.name.trim()) {
      console.error("❌ Validation failed: Missing banner name");
      alert('Please enter a banner name');
      return;
    }
    
    if (!form.imageUrl) {
      console.error("❌ Validation failed: Missing banner image");
      alert('Please select an image');
      return;
    }
    
    if (!form.imageUrl.startsWith('data:')) {
      console.error("❌ Validation failed: Invalid image format");
      alert('Invalid image format. Please select a valid image file.');
      return;
    }
    
    console.log("✅ Form validation passed");
    console.log("📤 Calling onSave with form data");
    
    onSave(form); // Pass the form data with the Base64 image string
    console.log("✅ onSave called successfully");
    onClose();
    console.log("✅ Modal closed");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Enhanced Debug Info */}
        <div style={{
          background: '#f8f9fa',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          fontSize: '12px',
          fontFamily: 'monospace',
          border: '1px solid #dee2e6'
        }}>
          <div><strong>🖼️ Banner Modal Debug Info</strong></div>
          <div><strong>Timestamp:</strong> 2025-08-07 20:42:58</div>
          <div><strong>User:</strong> BlackPheonix</div>
          <div><strong>Mode:</strong> {mode}</div>
          <div><strong>Has Image:</strong> {form.imageUrl ? 'Yes' : 'No'}</div>
          <div><strong>Image Type:</strong> {typeof form.imageUrl}</div>
          <div><strong>Is Base64:</strong> {form.imageUrl?.startsWith('data:') ? 'Yes' : 'No'}</div>
          <div><strong>Image Length:</strong> {form.imageUrl?.length || 0} characters</div>
          <div><strong>Form Valid:</strong> {form.name.trim() && form.imageUrl ? 'Yes' : 'No'}</div>
        </div>

        <div className="modal-header">
          <h2>{mode === 'edit' ? '✏️ Edit Banner' : '➕ Add New Banner'}</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Banner Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter banner name"
              required
              maxLength="100"
              style={{
                borderColor: form.name.trim() ? '#28a745' : '#dc3545'
              }}
            />
            <small style={{ color: '#6c757d' }}>
              {form.name.length}/100 characters
            </small>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter banner description (optional)"
              rows={3}
              maxLength="500"
            />
            <small style={{ color: '#6c757d' }}>
              {form.description.length}/500 characters
            </small>
          </div>
          
          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="Active">🟢 Active</option>
              <option value="Inactive">🔴 Inactive</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Banner Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required={mode === 'add' && !form.imageUrl}
              style={{
                padding: '10px',
                border: '2px dashed #99BC85',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa'
              }}
            />
            <small style={{ color: '#6c757d', display: 'block', marginTop: '5px' }}>
              📁 Supported formats: JPG, PNG, GIF, WebP | Max size: 5MB
            </small>
            
            {form.imageUrl && (
              <div className="image-preview-container" style={{ marginTop: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  🖼️ Preview:
                </label>
                <div style={{
                  border: '2px solid #99BC85',
                  borderRadius: '8px',
                  padding: '10px',
                  backgroundColor: '#fff',
                  textAlign: 'center'
                }}>
                  <img 
                    src={form.imageUrl} 
                    alt="Banner Preview" 
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      height: 'auto',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                    onLoad={() => console.log("✅ Preview image loaded successfully")}
                    onError={() => console.error("❌ Preview image failed to load")}
                  />
                  <div style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    color: '#6c757d',
                    fontFamily: 'monospace'
                  }}>
                    Size: {Math.round(form.imageUrl.length * 0.75 / 1024)} KB (Base64)
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="modal-actions" style={{ 
            marginTop: '25px', 
            paddingTop: '20px', 
            borderTop: '1px solid #dee2e6' 
          }}>
            <button 
              type="button" 
              onClick={onClose} 
              className="cancel-btn"
              style={{
                padding: '12px 24px',
                marginRight: '12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              ❌ Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={!form.name.trim() || !form.imageUrl}
              style={{
                padding: '12px 24px',
                backgroundColor: form.name.trim() && form.imageUrl ? '#99BC85' : '#dee2e6',
                color: form.name.trim() && form.imageUrl ? 'white' : '#6c757d',
                border: 'none',
                borderRadius: '6px',
                cursor: form.name.trim() && form.imageUrl ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {mode === 'edit' ? '💾 Save Changes' : '✅ Create Banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerModal;
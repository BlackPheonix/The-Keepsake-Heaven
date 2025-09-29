import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiImage, FiEye } from 'react-icons/fi';
import BannerModal from '../components/BannerModal';
import './Banners.css';
import { getAllBanners, deleteBanner, addBanner, updateBanner } from '../firebase/firebaseUtils';
import { auth } from '../firebase/FirebaseConfig';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    console.log("🖼️ Banners component mounted at 2025-08-07 20:48:27");
    console.log("🔐 Current admin:", auth.currentUser?.email);
    console.log("👤 Current user login: BlackPheonix");
    
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      console.log("📡 Fetching banners at 2025-08-07 20:48:27");
      setLoading(true);
      setError(null);
      
      const result = await getAllBanners();
      
      console.log("📦 Banners result:", result);
      
      if (result.success) {
        console.log("✅ Banners loaded successfully:", result.data.length, "items");
        setBanners(result.data);
        setError(null);
      } else {
        console.error("❌ Failed to load banners:", result.error);
        setError(result.error || "Failed to load banners");
      }
    } catch (err) {
      console.error("💥 Exception in fetchBanners:", err);
      setError("Failed to load banners: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBanner = () => {
    console.log("➕ Opening add banner modal at 2025-08-07 20:48:27");
    console.log("👤 User: BlackPheonix");
    setEditingBanner(null);
    setShowModal(true);
    setError(null);
  };

  const handleEditBanner = (banner) => {
    console.log("✏️ Editing banner at 2025-08-07 20:48:27:", banner);
    console.log("👤 User: BlackPheonix");
    setEditingBanner(banner);
    setShowModal(true);
    setError(null);
  };

  const handleDeleteBanner = async (bannerId, bannerName) => {
    const confirmMessage = `Are you sure you want to delete the banner "${bannerName}"?\n\nThis action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        console.log("🗑️ Deleting banner at 2025-08-07 20:48:27:", bannerId);
        console.log("👤 User: BlackPheonix");
        setLoading(true);
        setError(null);
        
        const result = await deleteBanner(bannerId);
        
        if (result.success) {
          setBanners(banners.filter(banner => banner.id !== bannerId));
          console.log("✅ Banner deleted successfully");
        } else {
          console.error("❌ Failed to delete banner:", result.error);
          setError("Failed to delete banner: " + result.error);
        }
      } catch (err) {
        console.error("💥 Error deleting banner:", err);
        setError("Failed to delete banner: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // CORRECTED handleSaveBanner function for Base64 approach
  const handleSaveBanner = async (bannerData) => {
    try {
      console.log("💾 Saving banner at 2025-08-07 20:48:27");
      console.log("👤 Current user: BlackPheonix");
      console.log("📋 Banner data received:", {
        name: bannerData.name,
        description: bannerData.description,
        status: bannerData.status,
        hasImage: !!bannerData.imageUrl,
        imageType: typeof bannerData.imageUrl,
        isBase64: bannerData.imageUrl?.startsWith('data:') ? 'Yes' : 'No',
        imageLength: bannerData.imageUrl?.length || 0
      });
      
      setLoading(true);
      setError(null);
      
      let result;
      if (editingBanner) {
        console.log("🔄 Updating existing banner:", editingBanner.id);
        // Update existing banner - ONLY pass bannerData (no imageFile)
        result = await updateBanner(editingBanner.id, bannerData);
        
        if (result.success) {
          setBanners(banners.map(b => 
            b.id === editingBanner.id ? result.data : b
          ));
          console.log("✅ Banner updated successfully:", result.data);
        }
      } else {
        console.log("➕ Adding new banner");
        // Add new banner - ONLY pass bannerData (no imageFile)
        result = await addBanner(bannerData);
        
        if (result.success) {
          setBanners([result.data, ...banners]);
          console.log("✅ Banner added successfully:", result.data);
        }
      }
      
      if (result.success) {
        setShowModal(false);
        setEditingBanner(null);
        setError(null);
        console.log("🎉 Banner operation completed successfully at 2025-08-07 20:48:27!");
      } else {
        console.error("❌ Failed to save banner:", result.error);
        setError("Failed to save banner: " + result.error);
      }
    } catch (err) {
      console.error("💥 Error saving banner:", err);
      setError("Failed to save banner: " + err.message);
    } finally {
      setLoading(false);
      console.log("🏁 Banner save operation finished at 2025-08-07 20:48:27");
    }
  };

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         banner.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || banner.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const activeBanners = banners.filter(b => b.status === 'Active').length;
  const inactiveBanners = banners.filter(b => b.status === 'Inactive').length;

  if (loading && banners.length === 0) {
    return (
      <div className="loading" style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        fontSize: '1.2rem',
        color: '#6c757d'
      }}>
        <div>🖼️ Loading banners...</div>
        <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Fetching banner data from Firebase at 2025-08-07 20:48:27...
        </div>
      </div>
    );
  }

  return (
    <div className="banners-page">
      {/* Enhanced Debug Panel */}
      <div style={{
        background: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px',
        fontSize: '13px',
        fontFamily: 'monospace'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>🖼️ Debug Information</h4>
        <div><strong>Current Time:</strong> 2025-08-07 20:48:27</div>
        <div><strong>Admin User:</strong> {auth.currentUser?.email || 'Not authenticated'}</div>
        <div><strong>User Login:</strong> BlackPheonix</div>
        <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
        <div><strong>Error:</strong> {error || 'None'}</div>
        <div><strong>Total Banners:</strong> {banners.length}</div>
        <div><strong>Filtered Banners:</strong> {filteredBanners.length}</div>
        <div><strong>Active Banners:</strong> {activeBanners}</div>
        <div><strong>Inactive Banners:</strong> {inactiveBanners}</div>
        <div><strong>Image Storage:</strong> Base64 (same as products)</div>
        <div><strong>Function Calls:</strong> addBanner(data), updateBanner(id, data)</div>
        
        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={fetchBanners} 
            style={{
              marginRight: '10px',
              padding: '8px 16px',
              background: '#99BC85',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            disabled={loading}
          >
            🔄 {loading ? 'Loading...' : 'Reload Banners'}
          </button>
          
          <button 
            onClick={() => setError(null)}
            style={{
              padding: '8px 16px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ❌ Clear Error
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="banners-header">
        <h1>Banner Management</h1>
        <button 
          className="add-banner-btn" 
          onClick={handleAddBanner}
          disabled={loading}
        >
          <FiPlus /> {loading ? 'Loading...' : 'Add New Banner'}
        </button>
      </div>

      {/* Enhanced Error Display */}
      {error && (
        <div className="error-message" style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          <strong>❌ Error:</strong> {error}
          <button 
            onClick={() => setError(null)}
            style={{
              marginLeft: '10px',
              padding: '4px 8px',
              background: 'transparent',
              color: '#721c24',
              border: '1px solid #721c24',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="banners-summary">
        <div className="summary-card">
          <FiImage className="summary-icon" />
          <div>
            <h3>Total Banners</h3>
            <p>{banners.length}</p>
          </div>
        </div>
        <div className="summary-card">
          <FiEye className="summary-icon" />
          <div>
            <h3>Active Banners</h3>
            <p>{activeBanners}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="status-icon inactive">●</div>
          <div>
            <h3>Inactive Banners</h3>
            <p>{inactiveBanners}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="status-icon success">📊</div>
          <div>
            <h3>Success Rate</h3>
            <p>{banners.length > 0 ? Math.round((activeBanners / banners.length) * 100) : 0}%</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="banners-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search banners by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="status-filter">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Banners Grid */}
      <div className="banners-grid">
        {filteredBanners.length > 0 ? (
          filteredBanners.map(banner => (
            <div key={banner.id} className="banner-card">
              <div className="banner-image">
                {banner.imageUrl ? (
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.name}
                    onError={(e) => {
                      console.log("❌ Failed to load banner image for:", banner.name);
                      console.log("❌ Image URL type:", typeof banner.imageUrl);
                      console.log("❌ Is Base64:", banner.imageUrl?.startsWith('data:'));
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                    onLoad={() => {
                      console.log("✅ Successfully loaded banner image for:", banner.name);
                      console.log("✅ Image is Base64:", banner.imageUrl?.startsWith('data:'));
                    }}
                  />
                ) : null}
                <div className="banner-placeholder" style={{ display: banner.imageUrl ? 'none' : 'flex' }}>
                  <FiImage size={48} />
                  <span>No Image</span>
                </div>
                <div className={`banner-status ${banner.status?.toLowerCase() || 'active'}`}>
                  {banner.status || 'Active'}
                </div>
              </div>
              <div className="banner-details">
                <h3>{banner.name}</h3>
                {banner.description && (
                  <p className="banner-description">{banner.description}</p>
                )}
                <div className="banner-meta">
                  <span className="banner-date">
                    Created: {banner.createdAt ? 
                      (banner.createdAt.toDate ? 
                        banner.createdAt.toDate().toLocaleDateString() : 
                        new Date(banner.createdAt).toLocaleDateString()
                      ) : 
                      'Unknown'
                    }
                  </span>
                  {banner.updatedAt && banner.createdAt && banner.updatedAt !== banner.createdAt && (
                    <span className="banner-updated">
                      Updated: {banner.updatedAt.toDate ? 
                        banner.updatedAt.toDate().toLocaleDateString() : 
                        new Date(banner.updatedAt).toLocaleDateString()
                      }
                    </span>
                  )}
                </div>
                <div className="banner-technical-info" style={{
                  fontSize: '11px',
                  color: '#6c757d',
                  fontFamily: 'monospace',
                  marginTop: '5px'
                }}>
                  <div>Image: {banner.imageUrl ? (banner.imageUrl.startsWith('data:') ? 'Base64' : 'URL') : 'None'}</div>
                  <div>Size: {banner.imageUrl ? Math.round(banner.imageUrl.length * 0.75 / 1024) + ' KB' : '0 KB'}</div>
                </div>
              </div>
              <div className="banner-actions">
                <button 
                  className="edit-btn" 
                  onClick={() => handleEditBanner(banner)}
                  title="Edit Banner"
                  disabled={loading}
                >
                  <FiEdit />
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDeleteBanner(banner.id, banner.name)}
                  title="Delete Banner"
                  disabled={loading}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-banners">
            <FiImage size={64} />
            <h3>No Banners Found</h3>
            <p>
              {banners.length === 0 
                ? "No banners created yet. Click 'Add New Banner' to create your first banner with Base64 image support (same as products)." 
                : `Found ${banners.length} banners, but none match your current filters.`
              }
            </p>
            {searchTerm || selectedStatus !== 'All' ? (
              <button 
                onClick={() => { 
                  setSearchTerm(''); 
                  setSelectedStatus('All'); 
                  console.log("🔄 Filters cleared at 2025-08-07 20:48:27");
                }}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Banner Modal */}
      {showModal && (
        <BannerModal 
          onClose={() => { 
            console.log("❌ Closing banner modal at 2025-08-07 20:48:27");
            console.log("👤 User: BlackPheonix");
            setShowModal(false); 
            setEditingBanner(null); 
            setError(null);
          }} 
          onSave={handleSaveBanner} 
          mode={editingBanner ? 'edit' : 'add'}
          banner={editingBanner}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Banners;
import React from 'react';
import '../styles/Popup.css'; 

const Popup = ({ isOpen, onClose, title, message, type = 'info' }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return '#28a745';
      case 'error':
        return '#dc3545';
      case 'warning':
        return '#ffc107';
      default:
        return '#007bff';
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <div className="popup-icon" style={{ color: getIconColor() }}>
            {getIcon()}
          </div>
          <h3 className="popup-title">{title}</h3>
          <button className="popup-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="popup-content">
          <p className="popup-message">{message}</p>
        </div>
        <div className="popup-footer">
          <button className="popup-button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
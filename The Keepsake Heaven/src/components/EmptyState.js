import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EmptyState = ({ 
  icon = 'fas fa-search', 
  title = 'No items found', 
  message = 'Try browsing other categories or check back later.',
  actionText = 'Browse Categories',
  actionLink = '/categories'
}) => {
  return (
    <div className="text-center py-5">
      <i className={`${icon} fa-3x text-muted mb-3`}></i>
      <h3>{title}</h3>
      <p className="text-muted">{message}</p>
      <Button as={Link} to={actionLink} variant="success">
        {actionText}
      </Button>
    </div>
  );
};

export default EmptyState;
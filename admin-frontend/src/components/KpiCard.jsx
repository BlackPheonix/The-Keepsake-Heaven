import React from 'react';
import './KpiCard.css';

const KpiCard = ({ title, value, icon, trend, trendValue }) => {
  return (
    <div className="kpi-card">
      <div className="kpi-icon">{icon}</div>
      <div className="kpi-content">
        <h3>{title}</h3>
        <p className="kpi-value">{value}</p>
        <div className={`kpi-trend ${trend}`}>
          {trend === 'up' ? '↑' : '↓'} {trendValue}
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
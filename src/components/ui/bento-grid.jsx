import React from 'react';

const BentoGrid = ({ children, className = '', gap = '16px' }) => {
  return (
    <div 
      className={`bento-grid ${className}`}
      style={{
        display: 'grid',
        gap: gap,
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gridAutoRows: 'minmax(120px, auto)',
        width: '100%'
      }}
    >
      {children}
    </div>
  );
};

const BentoCard = ({ 
  children, 
  className = '', 
  span = 1, 
  rowSpan = 1,
  onClick,
  hover = false,
  padding = '24px'
}) => {
  const cardStyle = {
    gridColumn: `span ${span}`,
    gridRow: `span ${rowSpan}`,
    padding: padding,
    cursor: onClick ? 'pointer' : 'default',
    transition: hover ? 'all 0.2s ease' : 'none'
  };

  const cardClass = `card ${className} ${hover ? 'hover:shadow-lg hover:scale-[1.02]' : ''}`;

  return (
    <div 
      className={cardClass}
      style={cardStyle}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const BentoHeader = ({ title, subtitle, icon: Icon, action }) => {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon size={20} className="text-primary" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

const BentoContent = ({ children, className = '' }) => {
  return (
    <div className={`flex-1 ${className}`}>
      {children}
    </div>
  );
};

const BentoFooter = ({ children, className = '' }) => {
  return (
    <div className={`mt-4 pt-4 border-t border-border ${className}`}>
      {children}
    </div>
  );
};

const BentoStat = ({ label, value, trend, trendDirection = 'up', icon: Icon }) => {
  const trendColor = trendDirection === 'up' ? 'text-green-600' : 'text-red-600';
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className="text-muted-foreground" />}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="text-right">
        <div className="font-semibold text-lg">{value}</div>
        {trend && (
          <div className={`text-xs ${trendColor}`}>
            {trendDirection === 'up' ? '↗' : '↘'} {trend}
          </div>
        )}
      </div>
    </div>
  );
};

const BentoList = ({ items, renderItem, emptyMessage = 'Nenhum item encontrado' }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={item.id || index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};

const BentoProgress = ({ value, max = 100, label, color = 'primary' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span className="text-muted-foreground">{value}/{max}</span>
        </div>
      )}
      <div className="w-full bg-secondary rounded-full h-2">
        <div 
          className={`bg-${color} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export { 
  BentoGrid, 
  BentoCard, 
  BentoHeader, 
  BentoContent, 
  BentoFooter, 
  BentoStat, 
  BentoList, 
  BentoProgress 
};
export default BentoGrid;


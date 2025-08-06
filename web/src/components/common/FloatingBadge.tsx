import React from 'react';

interface FloatingBadgeProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

const FloatingBadge: React.FC<FloatingBadgeProps> = ({ children, delay = 0, className = '' }) => (
    <div
        className={`floating-badge ${className}`}
        style={{
            animationDelay: `${delay}ms`,
            animation: 'float 6s ease-in-out infinite',
        }}
    >
        {children}
    </div>
);

export default FloatingBadge;

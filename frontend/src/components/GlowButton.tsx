import React from 'react';
import { useGlowEffect } from '../context/GlowEffectContext';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    maxGlowSize?: number;
    baseColor?: string;
    children: React.ReactNode;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
    maxGlowSize = 2,
    baseColor = 'skyblue',
    children,
    className = '',
    ...props
}) => {
    const { glowState } = useGlowEffect();

    return (
        <button
            className={`relative overflow-hidden ${className}`}
            {...props}
        >
            {children}
            <span
                className="absolute inset-0 opacity-0 transition-opacity duration-300"
                style={{
                    opacity: glowState.isActive ? 0.7 : 0,
                    background: `radial-gradient(circle at ${glowState.x}px ${glowState.y}px, 
                      ${baseColor}, transparent ${maxGlowSize}rem)`,
                    pointerEvents: 'none'
                }}
            />
        </button>
    );
};
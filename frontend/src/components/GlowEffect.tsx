import { ReactNode, useState, useEffect, useRef } from 'react';

interface MousePosition {
    x: number;
    y: number;
}

interface GlowEffectProps {
    children: (position: MousePosition) => ReactNode;
}

const GlowEffect: React.FC<GlowEffectProps> = ({ children }) => {
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
    const lastCall = useRef(0)
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const now = new Date().getTime();
            if (now - lastCall.current >= 30) {
                lastCall.current = now;
                setMousePosition({ x: e.clientX, y: e.clientY });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return <>{children(mousePosition)}</>;
};

export default GlowEffect;
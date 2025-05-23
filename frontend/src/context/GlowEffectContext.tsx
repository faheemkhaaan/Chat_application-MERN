import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
    FC,
    MouseEvent
} from 'react';

interface GlowState {
    x: number;
    y: number;
    isActive: boolean;
}

interface GlowContextType {
    glowState: GlowState;
    updateGlowPosition: (e: MouseEvent) => void;
    activateGlow: () => void;
    deactivateGlow: () => void;
}

// Create context with explicit type and no undefined in createContext
const GlowEffectContext = createContext<GlowContextType>({
    glowState: { x: 0, y: 0, isActive: false },
    updateGlowPosition: () => { },
    activateGlow: () => { },
    deactivateGlow: () => { }
});

interface GlowEffectProviderProps {
    children: ReactNode;
}

export const GlowEffectProvider: FC<GlowEffectProviderProps> = ({ children }) => {
    const [glowState, setGlowState] = useState<GlowState>({
        x: 0,
        y: 0,
        isActive: false
    });

    const updateGlowPosition = useCallback((e: MouseEvent) => {
        setGlowState(prev => ({
            ...prev,
            x: e.clientX,
            y: e.clientY
        }));
    }, []);

    const activateGlow = useCallback(() => {
        setGlowState(prev => ({ ...prev, isActive: true }));
    }, []);

    const deactivateGlow = useCallback(() => {
        setGlowState(prev => ({ ...prev, isActive: false }));
    }, []);

    const contextValue = React.useMemo(() => ({
        glowState,
        updateGlowPosition,
        activateGlow,
        deactivateGlow
    }), [glowState, updateGlowPosition, activateGlow, deactivateGlow]);

    return (
        <GlowEffectContext.Provider value={contextValue} >
            {children}
        </GlowEffectContext.Provider>
    );
};

export const useGlowEffect = (): GlowContextType => {
    const context = useContext(GlowEffectContext);
    if (!context) {
        throw new Error('useGlowEffect must be used within a GlowEffectProvider');
    }
    return context;
};
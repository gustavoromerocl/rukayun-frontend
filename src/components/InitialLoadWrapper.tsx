import type { ReactNode } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { useInitialLoad } from '@/hooks/useInitialLoad';

interface InitialLoadWrapperProps {
  children: ReactNode;
}

export function InitialLoadWrapper({ children }: InitialLoadWrapperProps) {
  const { isInitialLoadComplete, authLoading, comunasLoading } = useInitialLoad();

  console.log('🔄 InitialLoadWrapper - Estado:', {
    isInitialLoadComplete,
    authLoading,
    comunasLoading
  });

  // Solo mostrar loading si aún no se ha completado la carga inicial
  if (!isInitialLoadComplete) {
    console.log('⏳ InitialLoadWrapper - Mostrando LoadingScreen');
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <LoadingScreen />
      </div>
    );
  }

  console.log('✅ InitialLoadWrapper - Carga inicial completa, mostrando children');
  return <>{children}</>;
}
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Toaster } from '../sonner';

// Mock de next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

// Mock de sonner
vi.mock('sonner', () => ({
  Toaster: ({ className, style, theme, ...props }: any) => {
    // Filtrar props que no son atributos válidos del DOM
    const { richColors, closeButton, expand, invert, toastOptions, hotkey, visibleToasts, ...domProps } = props;
    return (
      <div 
        data-testid="toaster"
        className={className}
        style={style}
        data-theme={theme}
        data-position={props.position}
        data-duration={props.duration}
        data-rich-colors={richColors ? 'true' : undefined}
        data-close-button={closeButton ? 'true' : undefined}
        data-expand={expand ? 'true' : undefined}
        data-invert={invert ? 'true' : undefined}
        data-visible-toasts={visibleToasts}
        {...domProps}
      />
    );
  },
}));

describe('Toaster', () => {
  it('debería renderizar el toaster por defecto', () => {
    render(<Toaster data-testid="toaster" />);
    
    const toaster = screen.getByTestId('toaster');
    expect(toaster).toBeInTheDocument();
    expect(toaster).toHaveClass('toaster', 'group');
  });

  it('debería aplicar el tema del sistema', () => {
    render(<Toaster data-testid="toaster" />);
    
    const toaster = screen.getByTestId('toaster');
    expect(toaster).toHaveAttribute('data-theme', 'light');
  });

  it('debería aplicar estilos CSS personalizados', () => {
    render(<Toaster data-testid="toaster" />);
    
    const toaster = screen.getByTestId('toaster');
    expect(toaster).toHaveStyle({
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
    });
  });

  it('debería pasar props adicionales al componente', () => {
    render(
      <Toaster 
        data-testid="toaster"
        position="top-right"
        duration={5000}
        richColors
      />
    );
    
    const toaster = screen.getByTestId('toaster');
    expect(toaster).toHaveAttribute('data-position', 'top-right');
    expect(toaster).toHaveAttribute('data-duration', '5000');
    expect(toaster).toHaveAttribute('data-rich-colors', 'true');
  });

  it('debería manejar position prop', () => {
    render(<Toaster position="bottom-left" data-testid="toaster" />);
    
    const toaster = screen.getByTestId('toaster');
    expect(toaster).toHaveAttribute('data-position', 'bottom-left');
  });

  it('debería manejar duration prop', () => {
    render(<Toaster duration={3000} data-testid="toaster" />);
    
    const toaster = screen.getByTestId('toaster');
    expect(toaster).toHaveAttribute('data-duration', '3000');
  });

  it('debería manejar richColors prop', () => {
    render(<Toaster richColors data-testid="toaster" />);
    
    const toaster = screen.getByTestId('toaster');
    expect(toaster).toHaveAttribute('data-rich-colors', 'true');
  });

  it('debería manejar closeButton prop', () => {
    render(<Toaster closeButton data-testid="toaster" />);
    
    const toaster = screen.getByTestId('toaster');
    expect(toaster).toHaveAttribute('data-close-button', 'true');
  });

  it('debería manejar expand prop', () => {
    render(<Toaster expand data-testid="toaster" />);
    
    const toaster = screen.getByTestId('toaster');
    expect(toaster).toHaveAttribute('data-expand', 'true');
  });

  it('debería manejar invert prop', () => {
    render(<Toaster invert data-testid="toaster" />);
    
    const toaster = screen.getByTestId('toaster');
    expect(toaster).toHaveAttribute('data-invert', 'true');
  });

  it('debería manejar toastOptions prop', () => {
    const toastOptions = {
      duration: 4000,
      className: 'custom-toast',
    };
    
    render(<Toaster toastOptions={toastOptions} data-testid="toaster" />);
    
    const toaster = screen.getByTestId('toaster');
    expect(toaster).toBeInTheDocument();
  });

  it('debería manejar hotkey prop', () => {
    render(<Toaster hotkey={['ctrlKey', 'KeyT']} data-testid="toaster" />);
    
    const toaster = screen.getByTestId('toaster');
    expect(toaster).toBeInTheDocument();
  });

  it('debería manejar visibleToasts prop', () => {
    render(<Toaster visibleToasts={3} data-testid="toaster" />);
    
    const toaster = screen.getByTestId('toaster');
    expect(toaster).toHaveAttribute('data-visible-toasts', '3');
  });
}); 
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../button';

// Mock de cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('Button', () => {
  it('debería renderizar un botón por defecto', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-slot', 'button');
  });

  it('debería renderizar con texto personalizado', () => {
    render(<Button>Custom Text</Button>);
    
    const button = screen.getByRole('button', { name: 'Custom Text' });
    expect(button).toBeInTheDocument();
  });

  it('debería manejar click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('debería estar deshabilitado cuando disabled es true', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('debería aplicar className personalizada', () => {
    render(<Button className="custom-class">Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  describe('Variantes', () => {
    it('debería renderizar variante default', () => {
      render(<Button variant="default">Default Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('debería renderizar variante destructive', () => {
      render(<Button variant="destructive">Destructive Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('debería renderizar variante outline', () => {
      render(<Button variant="outline">Outline Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('debería renderizar variante secondary', () => {
      render(<Button variant="secondary">Secondary Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('debería renderizar variante ghost', () => {
      render(<Button variant="ghost">Ghost Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('debería renderizar variante link', () => {
      render(<Button variant="link">Link Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Tamaños', () => {
    it('debería renderizar tamaño default', () => {
      render(<Button size="default">Default Size</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('debería renderizar tamaño sm', () => {
      render(<Button size="sm">Small Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('debería renderizar tamaño lg', () => {
      render(<Button size="lg">Large Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('debería renderizar tamaño icon', () => {
      render(<Button size="icon">Icon Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Props adicionales', () => {
    it('debería pasar props adicionales al elemento', () => {
      render(<Button data-testid="custom-button" aria-label="Custom label">Button</Button>);
      
      const button = screen.getByTestId('custom-button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
    });

    it('debería manejar type attribute', () => {
      render(<Button type="submit">Submit Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('debería manejar name attribute', () => {
      render(<Button name="test-button">Named Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('name', 'test-button');
    });
  });

  describe('asChild prop', () => {
    it('debería renderizar como Slot cuando asChild es true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveAttribute('data-slot', 'button');
    });

    it('debería renderizar como button por defecto', () => {
      render(<Button>Regular Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('Accesibilidad', () => {
    it('debería ser focusable', () => {
      render(<Button>Focusable Button</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('debería manejar keyboard events', () => {
      const handleKeyDown = vi.fn();
      render(<Button onKeyDown={handleKeyDown}>Keyboard Button</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Enter' });
      
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });

    it('debería tener aria-invalid cuando se proporciona', () => {
      render(<Button aria-invalid="true">Invalid Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-invalid', 'true');
    });
  });
}); 
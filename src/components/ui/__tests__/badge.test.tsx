import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Badge } from '../badge';

// Mock de cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('Badge', () => {
  it('debería renderizar un badge por defecto', () => {
    render(<Badge>Test Badge</Badge>);
    
    const badge = screen.getByText('Test Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-slot', 'badge');
  });

  it('debería aplicar className personalizada', () => {
    render(<Badge className="custom-class">Test Badge</Badge>);
    
    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('custom-class');
  });

  describe('Variantes', () => {
    it('debería renderizar variante default', () => {
      render(<Badge variant="default">Default Badge</Badge>);
      
      const badge = screen.getByText('Default Badge');
      expect(badge).toBeInTheDocument();
    });

    it('debería renderizar variante secondary', () => {
      render(<Badge variant="secondary">Secondary Badge</Badge>);
      
      const badge = screen.getByText('Secondary Badge');
      expect(badge).toBeInTheDocument();
    });

    it('debería renderizar variante destructive', () => {
      render(<Badge variant="destructive">Destructive Badge</Badge>);
      
      const badge = screen.getByText('Destructive Badge');
      expect(badge).toBeInTheDocument();
    });

    it('debería renderizar variante outline', () => {
      render(<Badge variant="outline">Outline Badge</Badge>);
      
      const badge = screen.getByText('Outline Badge');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Props adicionales', () => {
    it('debería pasar props adicionales al elemento', () => {
      render(<Badge data-testid="custom-badge" aria-label="Custom badge">Badge</Badge>);
      
      const badge = screen.getByTestId('custom-badge');
      expect(badge).toHaveAttribute('aria-label', 'Custom badge');
    });

    it('debería manejar id attribute', () => {
      render(<Badge id="badge-id">Badge with ID</Badge>);
      
      const badge = screen.getByText('Badge with ID');
      expect(badge).toHaveAttribute('id', 'badge-id');
    });

    it('debería manejar role attribute', () => {
      render(<Badge role="status">Status Badge</Badge>);
      
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('asChild prop', () => {
    it('debería renderizar como Slot cuando asChild es true', () => {
      render(
        <Badge asChild>
          <a href="/test">Link Badge</a>
        </Badge>
      );
      
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveAttribute('data-slot', 'badge');
    });

    it('debería renderizar como span por defecto', () => {
      render(<Badge>Regular Badge</Badge>);
      
      const badge = screen.getByText('Regular Badge');
      expect(badge).toBeInTheDocument();
      expect(badge.tagName).toBe('SPAN');
    });
  });

  describe('Accesibilidad', () => {
    it('debería ser focusable cuando tiene tabIndex', () => {
      render(<Badge tabIndex={0}>Focusable Badge</Badge>);
      
      const badge = screen.getByText('Focusable Badge');
      badge.focus();
      expect(badge).toHaveFocus();
    });

    it('debería tener aria-invalid cuando se proporciona', () => {
      render(<Badge aria-invalid="true">Invalid Badge</Badge>);
      
      const badge = screen.getByText('Invalid Badge');
      expect(badge).toHaveAttribute('aria-invalid', 'true');
    });

    it('debería tener aria-label cuando se proporciona', () => {
      render(<Badge aria-label="Notification count">5</Badge>);
      
      const badge = screen.getByText('5');
      expect(badge).toHaveAttribute('aria-label', 'Notification count');
    });
  });

  describe('Contenido', () => {
    it('debería renderizar texto simple', () => {
      render(<Badge>Simple Text</Badge>);
      
      const badge = screen.getByText('Simple Text');
      expect(badge).toBeInTheDocument();
    });

    it('debería renderizar números', () => {
      render(<Badge>42</Badge>);
      
      const badge = screen.getByText('42');
      expect(badge).toBeInTheDocument();
    });

    it('debería renderizar contenido complejo', () => {
      render(
        <Badge>
          <span>Icon</span>
          <span>Text</span>
        </Badge>
      );
      
      const badge = screen.getByText('Icon');
      expect(badge).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });
  });
}); 
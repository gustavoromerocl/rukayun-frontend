import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '../input';

// Mock de cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('Input', () => {
  it('debería renderizar un input por defecto', () => {
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('data-slot', 'input');
    // El tipo por defecto es undefined, pero el navegador lo trata como text
    expect(input).not.toHaveAttribute('type');
  });

  it('debería renderizar con placeholder', () => {
    render(<Input placeholder="Enter text here" />);
    
    const input = screen.getByPlaceholderText('Enter text here');
    expect(input).toBeInTheDocument();
  });

  it('debería manejar cambios de valor', () => {
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(input).toHaveValue('test value');
  });

  it('debería estar deshabilitado cuando disabled es true', () => {
    render(<Input disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('debería aplicar className personalizada', () => {
    render(<Input className="custom-class" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  describe('Tipos de input', () => {
    it('debería renderizar tipo text por defecto', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      // El tipo por defecto es undefined, pero el navegador lo trata como text
      expect(input).not.toHaveAttribute('type');
    });

    it('debería renderizar tipo email', () => {
      render(<Input type="email" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('debería renderizar tipo password', () => {
      render(<Input type="password" />);
      
      const input = screen.getByDisplayValue('');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('debería renderizar tipo number', () => {
      render(<Input type="number" />);
      
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('debería renderizar tipo search', () => {
      render(<Input type="search" />);
      
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('type', 'search');
    });

    it('debería renderizar tipo tel', () => {
      render(<Input type="tel" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'tel');
    });

    it('debería renderizar tipo url', () => {
      render(<Input type="url" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'url');
    });

    it('debería renderizar tipo file', () => {
      render(<Input type="file" />);
      
      const input = screen.getByDisplayValue('');
      expect(input).toHaveAttribute('type', 'file');
    });
  });

  describe('Props adicionales', () => {
    it('debería pasar props adicionales al elemento', () => {
      render(<Input data-testid="custom-input" aria-label="Custom label" />);
      
      const input = screen.getByTestId('custom-input');
      expect(input).toHaveAttribute('aria-label', 'Custom label');
    });

    it('debería manejar name attribute', () => {
      render(<Input name="test-input" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'test-input');
    });

    it('debería manejar id attribute', () => {
      render(<Input id="test-id" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'test-id');
    });

    it('debería manejar value attribute', () => {
      render(<Input value="initial value" readOnly />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('initial value');
    });

    it('debería manejar defaultValue attribute', () => {
      render(<Input defaultValue="default value" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('default value');
    });

    it('debería manejar required attribute', () => {
      render(<Input required />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('debería manejar readOnly attribute', () => {
      render(<Input readOnly />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
    });

    it('debería manejar maxLength attribute', () => {
      render(<Input maxLength={10} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxlength', '10');
    });

    it('debería manejar minLength attribute', () => {
      render(<Input minLength={5} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('minlength', '5');
    });
  });

  describe('Eventos', () => {
    it('debería manejar onChange event', () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'new value' } });
      
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('debería manejar onFocus event', () => {
      const handleFocus = vi.fn();
      render(<Input onFocus={handleFocus} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('debería manejar onBlur event', () => {
      const handleBlur = vi.fn();
      render(<Input onBlur={handleBlur} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.blur(input);
      
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('debería manejar onKeyDown event', () => {
      const handleKeyDown = vi.fn();
      render(<Input onKeyDown={handleKeyDown} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'Enter' });
      
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accesibilidad', () => {
    it('debería ser focusable', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      input.focus();
      expect(input).toHaveFocus();
    });

    it('debería tener aria-invalid cuando se proporciona', () => {
      render(<Input aria-invalid="true" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('debería tener aria-describedby cuando se proporciona', () => {
      render(<Input aria-describedby="error-message" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'error-message');
    });

    it('debería tener aria-label cuando se proporciona', () => {
      render(<Input aria-label="Email address" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Email address');
    });
  });

  describe('Validación', () => {
    it('debería manejar pattern attribute', () => {
      render(<Input pattern="[0-9]{3}" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('pattern', '[0-9]{3}');
    });

    it('debería manejar min attribute para number', () => {
      render(<Input type="number" min={0} />);
      
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('min', '0');
    });

    it('debería manejar max attribute para number', () => {
      render(<Input type="number" max={100} />);
      
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('max', '100');
    });
  });
}); 
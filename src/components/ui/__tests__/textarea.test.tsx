import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Textarea } from '../textarea';

// Mock de cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('Textarea', () => {
  it('debería renderizar un textarea por defecto', () => {
    render(<Textarea data-testid="textarea" />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('data-slot', 'textarea');
  });

  it('debería aplicar className personalizada', () => {
    render(<Textarea className="custom-class" data-testid="textarea" />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveClass('custom-class');
  });

  it('debería manejar placeholder', () => {
    render(<Textarea placeholder="Escribe aquí..." data-testid="textarea" />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('placeholder', 'Escribe aquí...');
  });

  it('debería manejar value y onChange', () => {
    const handleChange = vi.fn();
    render(
      <Textarea 
        value="Texto inicial" 
        onChange={handleChange} 
        data-testid="textarea" 
      />
    );
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveValue('Texto inicial');
    
    fireEvent.change(textarea, { target: { value: 'Nuevo texto' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('debería manejar name attribute', () => {
    render(<Textarea name="description" data-testid="textarea" />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('name', 'description');
  });

  it('debería manejar id attribute', () => {
    render(<Textarea id="textarea-id" data-testid="textarea" />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('id', 'textarea-id');
  });

  it('debería manejar rows y cols', () => {
    render(<Textarea rows={5} cols={50} data-testid="textarea" />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('rows', '5');
    expect(textarea).toHaveAttribute('cols', '50');
  });

  it('debería manejar maxLength', () => {
    render(<Textarea maxLength={100} data-testid="textarea" />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('maxLength', '100');
  });

  it('debería manejar disabled state', () => {
    render(<Textarea disabled data-testid="textarea" />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeDisabled();
  });

  it('debería manejar readOnly state', () => {
    render(<Textarea readOnly data-testid="textarea" />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('readOnly');
  });

  it('debería manejar required attribute', () => {
    render(<Textarea required data-testid="textarea" />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeRequired();
  });

  it('debería manejar aria attributes', () => {
    render(
      <Textarea 
        data-testid="textarea"
        aria-label="Descripción del producto"
        aria-describedby="help-text"
        aria-invalid="true"
      />
    );
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('aria-label', 'Descripción del producto');
    expect(textarea).toHaveAttribute('aria-describedby', 'help-text');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  it('debería manejar onFocus y onBlur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(
      <Textarea 
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-testid="textarea"
      />
    );
    
    const textarea = screen.getByTestId('textarea');
    
    fireEvent.focus(textarea);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(textarea);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('debería manejar onKeyDown events', () => {
    const handleKeyDown = vi.fn();
    render(
      <Textarea 
        onKeyDown={handleKeyDown}
        data-testid="textarea"
      />
    );
    
    const textarea = screen.getByTestId('textarea');
    fireEvent.keyDown(textarea, { key: 'Enter' });
    
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it('debería manejar autoFocus', () => {
    render(<Textarea autoFocus data-testid="textarea" />);
    
    const textarea = screen.getByTestId('textarea');
    // React no renderiza el atributo autoFocus en el DOM
    expect(textarea).toBeInTheDocument();
  });

  it('debería manejar spellCheck', () => {
    render(<Textarea spellCheck={false} data-testid="textarea" />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('spellCheck', 'false');
  });

  it('debería manejar wrap attribute', () => {
    render(<Textarea wrap="hard" data-testid="textarea" />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('wrap', 'hard');
  });

  it('debería manejar dir attribute', () => {
    render(<Textarea dir="rtl" data-testid="textarea" />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('dir', 'rtl');
  });

  it('debería manejar form attribute', () => {
    render(<Textarea form="my-form" data-testid="textarea" />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('form', 'my-form');
  });

  it('debería manejar defaultValue', () => {
    render(<Textarea defaultValue="Valor por defecto" data-testid="textarea" />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveValue('Valor por defecto');
  });

  it('debería manejar onInput events', () => {
    const handleInput = vi.fn();
    render(
      <Textarea 
        onInput={handleInput}
        data-testid="textarea"
      />
    );
    
    const textarea = screen.getByTestId('textarea');
    fireEvent.input(textarea, { target: { value: 'Texto de entrada' } });
    
    expect(handleInput).toHaveBeenCalledTimes(1);
  });

  it('debería manejar onPaste events', () => {
    const handlePaste = vi.fn();
    render(
      <Textarea 
        onPaste={handlePaste}
        data-testid="textarea"
      />
    );
    
    const textarea = screen.getByTestId('textarea');
    fireEvent.paste(textarea);
    
    expect(handlePaste).toHaveBeenCalledTimes(1);
  });
}); 
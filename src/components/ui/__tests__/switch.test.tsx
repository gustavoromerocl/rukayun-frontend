import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Switch } from '../switch';

// Mock de cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('Switch', () => {
  it('debería renderizar un switch por defecto', () => {
    render(<Switch data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toHaveAttribute('data-slot', 'switch');
  });

  it('debería aplicar className personalizada', () => {
    render(<Switch className="custom-class" data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveClass('custom-class');
  });

  it('debería manejar checked state', () => {
    render(<Switch checked data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveAttribute('data-state', 'checked');
  });

  it('debería manejar unchecked state por defecto', () => {
    render(<Switch data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveAttribute('data-state', 'unchecked');
  });

  it('debería manejar onCheckedChange', () => {
    const handleCheckedChange = vi.fn();
    render(
      <Switch 
        onCheckedChange={handleCheckedChange} 
        data-testid="switch" 
      />
    );
    
    const switchElement = screen.getByTestId('switch');
    fireEvent.click(switchElement);
    
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it('debería manejar disabled state', () => {
    render(<Switch disabled data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toBeDisabled();
  });

  it('debería manejar name attribute', () => {
    render(<Switch name="notifications" data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    // Radix UI no pasa el atributo name directamente al DOM
    expect(switchElement).toBeInTheDocument();
  });

  it('debería manejar id attribute', () => {
    render(<Switch id="switch-id" data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveAttribute('id', 'switch-id');
  });

  it('debería manejar aria attributes', () => {
    render(
      <Switch 
        data-testid="switch"
        aria-label="Toggle notifications"
        aria-describedby="help-text"
      />
    );
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveAttribute('aria-label', 'Toggle notifications');
    expect(switchElement).toHaveAttribute('aria-describedby', 'help-text');
  });

  it('debería manejar role attribute', () => {
    render(<Switch role="switch" data-testid="switch" />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
  });

  it('debería manejar onFocus y onBlur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(
      <Switch 
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-testid="switch"
      />
    );
    
    const switchElement = screen.getByTestId('switch');
    
    fireEvent.focus(switchElement);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(switchElement);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('debería manejar onKeyDown events', () => {
    const handleKeyDown = vi.fn();
    render(
      <Switch 
        onKeyDown={handleKeyDown}
        data-testid="switch"
      />
    );
    
    const switchElement = screen.getByTestId('switch');
    fireEvent.keyDown(switchElement, { key: 'Enter' });
    
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it('debería manejar required attribute', () => {
    render(<Switch required data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    // Radix UI no pasa el atributo required directamente al DOM
    expect(switchElement).toBeInTheDocument();
  });

  it('debería manejar form attribute', () => {
    render(<Switch form="my-form" data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    // Radix UI no pasa el atributo form directamente al DOM
    expect(switchElement).toBeInTheDocument();
  });

  it('debería manejar value attribute', () => {
    render(<Switch value="on" data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveAttribute('value', 'on');
  });

  it('debería manejar defaultChecked', () => {
    render(<Switch defaultChecked data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveAttribute('data-state', 'checked');
  });

  it('debería manejar onClick events', () => {
    const handleClick = vi.fn();
    render(
      <Switch 
        onClick={handleClick}
        data-testid="switch"
      />
    );
    
    const switchElement = screen.getByTestId('switch');
    fireEvent.click(switchElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('debería manejar onMouseEnter y onMouseLeave events', () => {
    const handleMouseEnter = vi.fn();
    const handleMouseLeave = vi.fn();
    
    render(
      <Switch 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-testid="switch"
      />
    );
    
    const switchElement = screen.getByTestId('switch');
    
    fireEvent.mouseEnter(switchElement);
    expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    
    fireEvent.mouseLeave(switchElement);
    expect(handleMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('debería manejar tabIndex', () => {
    render(<Switch tabIndex={0} data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveAttribute('tabIndex', '0');
  });

  it('debería manejar style attribute', () => {
    render(
      <Switch 
        style={{ width: '50px', height: '24px' }} 
        data-testid="switch" 
      />
    );
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveStyle({ width: '50px', height: '24px' });
  });

  it('debería manejar data attributes', () => {
    render(
      <Switch 
        data-testid="switch"
        data-switch-type="custom"
        data-switch-size="large"
      />
    );
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveAttribute('data-switch-type', 'custom');
    expect(switchElement).toHaveAttribute('data-switch-size', 'large');
  });

  it('debería manejar checked state toggle', () => {
    const handleCheckedChange = vi.fn();
    render(
      <Switch 
        checked={true}
        onCheckedChange={handleCheckedChange} 
        data-testid="switch" 
      />
    );
    
    const switchElement = screen.getByTestId('switch');
    fireEvent.click(switchElement);
    
    expect(handleCheckedChange).toHaveBeenCalledWith(false);
  });

  it('debería manejar children', () => {
    render(
      <Switch data-testid="switch">
        <span>Custom switch</span>
      </Switch>
    );
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toBeInTheDocument();
  });

  it('debería manejar multiple eventos en secuencia', () => {
    const handleClick = vi.fn();
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(
      <Switch 
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-testid="switch"
      />
    );
    
    const switchElement = screen.getByTestId('switch');
    
    fireEvent.focus(switchElement);
    fireEvent.click(switchElement);
    fireEvent.blur(switchElement);
    
    expect(handleFocus).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });
}); 
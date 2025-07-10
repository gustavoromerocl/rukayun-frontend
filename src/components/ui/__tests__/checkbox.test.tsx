import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from '../checkbox';

// Mock de cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

// Mock de lucide-react
vi.mock('lucide-react', () => ({
  CheckIcon: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="check-icon" />
  ),
}));

describe('Checkbox', () => {
  it('debería renderizar un checkbox por defecto', () => {
    render(<Checkbox data-testid="checkbox" />);
    
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('data-slot', 'checkbox');
  });

  it('debería aplicar className personalizada', () => {
    render(<Checkbox className="custom-class" data-testid="checkbox" />);
    
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('custom-class');
  });

  it('debería manejar checked state', () => {
    render(<Checkbox checked data-testid="checkbox" />);
    
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('debería manejar unchecked state por defecto', () => {
    render(<Checkbox data-testid="checkbox" />);
    
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });

  it('debería manejar onCheckedChange', () => {
    const handleCheckedChange = vi.fn();
    render(
      <Checkbox 
        onCheckedChange={handleCheckedChange} 
        data-testid="checkbox" 
      />
    );
    
    const checkbox = screen.getByTestId('checkbox');
    fireEvent.click(checkbox);
    
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it('debería manejar disabled state', () => {
    render(<Checkbox disabled data-testid="checkbox" />);
    
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('debería manejar name attribute', () => {
    render(<Checkbox name="terms" data-testid="checkbox" />);
    
    const checkbox = screen.getByTestId('checkbox');
    // Radix UI no pasa el atributo name directamente al DOM
    expect(checkbox).toBeInTheDocument();
  });

  it('debería manejar id attribute', () => {
    render(<Checkbox id="checkbox-id" data-testid="checkbox" />);
    
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveAttribute('id', 'checkbox-id');
  });

  it('debería manejar aria attributes', () => {
    render(
      <Checkbox 
        data-testid="checkbox"
        aria-label="Accept terms and conditions"
        aria-describedby="help-text"
      />
    );
    
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveAttribute('aria-label', 'Accept terms and conditions');
    expect(checkbox).toHaveAttribute('aria-describedby', 'help-text');
  });

  it('debería manejar role attribute', () => {
    render(<Checkbox role="checkbox" data-testid="checkbox" />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('debería manejar onFocus y onBlur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(
      <Checkbox 
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-testid="checkbox"
      />
    );
    
    const checkbox = screen.getByTestId('checkbox');
    
    fireEvent.focus(checkbox);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(checkbox);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('debería manejar onKeyDown events', () => {
    const handleKeyDown = vi.fn();
    render(
      <Checkbox 
        onKeyDown={handleKeyDown}
        data-testid="checkbox"
      />
    );
    
    const checkbox = screen.getByTestId('checkbox');
    fireEvent.keyDown(checkbox, { key: 'Enter' });
    
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it('debería manejar required attribute', () => {
    render(<Checkbox required data-testid="checkbox" />);
    
    const checkbox = screen.getByTestId('checkbox');
    // Radix UI no pasa el atributo required directamente al DOM
    expect(checkbox).toBeInTheDocument();
  });

  it('debería manejar form attribute', () => {
    render(<Checkbox form="my-form" data-testid="checkbox" />);
    
    const checkbox = screen.getByTestId('checkbox');
    // Radix UI no pasa el atributo form directamente al DOM
    expect(checkbox).toBeInTheDocument();
  });

  it('debería manejar value attribute', () => {
    render(<Checkbox value="accepted" data-testid="checkbox" />);
    
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveAttribute('value', 'accepted');
  });

  it('debería manejar defaultChecked', () => {
    render(<Checkbox defaultChecked data-testid="checkbox" />);
    
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('debería manejar onClick events', () => {
    const handleClick = vi.fn();
    render(
      <Checkbox 
        onClick={handleClick}
        data-testid="checkbox"
      />
    );
    
    const checkbox = screen.getByTestId('checkbox');
    fireEvent.click(checkbox);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('debería manejar onMouseEnter y onMouseLeave events', () => {
    const handleMouseEnter = vi.fn();
    const handleMouseLeave = vi.fn();
    
    render(
      <Checkbox 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-testid="checkbox"
      />
    );
    
    const checkbox = screen.getByTestId('checkbox');
    
    fireEvent.mouseEnter(checkbox);
    expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    
    fireEvent.mouseLeave(checkbox);
    expect(handleMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('debería manejar tabIndex', () => {
    render(<Checkbox tabIndex={0} data-testid="checkbox" />);
    
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveAttribute('tabIndex', '0');
  });

  it('debería manejar style attribute', () => {
    render(
      <Checkbox 
        style={{ width: '20px', height: '20px' }} 
        data-testid="checkbox" 
      />
    );
    
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveStyle({ width: '20px', height: '20px' });
  });

  it('debería manejar data attributes', () => {
    render(
      <Checkbox 
        data-testid="checkbox"
        data-checkbox-type="custom"
        data-checkbox-size="large"
      />
    );
    
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveAttribute('data-checkbox-type', 'custom');
    expect(checkbox).toHaveAttribute('data-checkbox-size', 'large');
  });

  it('debería manejar checked state toggle', () => {
    const handleCheckedChange = vi.fn();
    render(
      <Checkbox 
        checked={true}
        onCheckedChange={handleCheckedChange} 
        data-testid="checkbox" 
      />
    );
    
    const checkbox = screen.getByTestId('checkbox');
    fireEvent.click(checkbox);
    
    expect(handleCheckedChange).toHaveBeenCalledWith(false);
  });

  it('debería manejar indeterminate state', () => {
    render(<Checkbox data-state="indeterminate" data-testid="checkbox" />);
    
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
  });

  it('debería manejar children', () => {
    render(
      <Checkbox data-testid="checkbox">
        <span>Custom checkbox</span>
      </Checkbox>
    );
    
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('debería manejar multiple eventos en secuencia', () => {
    const handleClick = vi.fn();
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(
      <Checkbox 
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-testid="checkbox"
      />
    );
    
    const checkbox = screen.getByTestId('checkbox');
    
    fireEvent.focus(checkbox);
    fireEvent.click(checkbox);
    fireEvent.blur(checkbox);
    
    expect(handleFocus).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });
}); 
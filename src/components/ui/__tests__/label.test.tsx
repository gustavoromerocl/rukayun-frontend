import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Label } from '../label';

// Mock de cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('Label', () => {
  it('debería renderizar un label por defecto', () => {
    render(<Label>Test Label</Label>);
    
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('data-slot', 'label');
  });

  it('debería aplicar className personalizada', () => {
    render(<Label className="custom-class">Test Label</Label>);
    
    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('custom-class');
  });

  it('debería pasar props adicionales', () => {
    render(<Label htmlFor="test-input" data-testid="test-label">Test Label</Label>);
    
    const label = screen.getByTestId('test-label');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('debería manejar htmlFor attribute', () => {
    render(<Label htmlFor="input-id">Input Label</Label>);
    
    const label = screen.getByText('Input Label');
    expect(label).toHaveAttribute('for', 'input-id');
  });

  it('debería manejar id attribute', () => {
    render(<Label id="label-id">Label with ID</Label>);
    
    const label = screen.getByText('Label with ID');
    expect(label).toHaveAttribute('id', 'label-id');
  });

  it('debería manejar aria-label attribute', () => {
    render(<Label aria-label="Accessible label">Label Text</Label>);
    
    const label = screen.getByText('Label Text');
    expect(label).toHaveAttribute('aria-label', 'Accessible label');
  });

  it('debería manejar aria-describedby attribute', () => {
    render(<Label aria-describedby="description">Label Text</Label>);
    
    const label = screen.getByText('Label Text');
    expect(label).toHaveAttribute('aria-describedby', 'description');
  });

  it('debería ser focusable', () => {
    render(<Label tabIndex={0}>Focusable Label</Label>);
    
    const label = screen.getByText('Focusable Label');
    label.focus();
    expect(label).toHaveFocus();
  });

  it('debería manejar onClick events', () => {
    const handleClick = vi.fn();
    render(<Label onClick={handleClick}>Clickable Label</Label>);
    
    const label = screen.getByText('Clickable Label');
    label.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
}); 
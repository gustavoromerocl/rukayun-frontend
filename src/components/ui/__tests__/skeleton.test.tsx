import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Skeleton } from '../skeleton';

// Mock de cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('Skeleton', () => {
  it('debería renderizar un skeleton por defecto', () => {
    render(<Skeleton data-testid="skeleton" />);
    
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton.tagName).toBe('DIV');
  });

  it('debería aplicar className personalizada', () => {
    render(<Skeleton className="custom-class" data-testid="skeleton" />);
    
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('custom-class');
  });

  it('debería tener las clases base por defecto', () => {
    render(<Skeleton data-testid="skeleton" />);
    
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('animate-pulse', 'rounded-md', 'bg-muted');
  });

  it('debería pasar props adicionales al elemento', () => {
    render(
      <Skeleton 
        data-testid="skeleton"
        aria-label="Loading content"
        role="status"
      />
    );
    
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading content');
    expect(skeleton).toHaveAttribute('role', 'status');
  });

  it('debería manejar id attribute', () => {
    render(<Skeleton id="skeleton-id" data-testid="skeleton" />);
    
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('id', 'skeleton-id');
  });

  it('debería manejar style attribute', () => {
    render(
      <Skeleton 
        style={{ width: '100px', height: '20px' }} 
        data-testid="skeleton" 
      />
    );
    
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveStyle({ width: '100px', height: '20px' });
  });

  it('debería manejar data attributes', () => {
    render(
      <Skeleton 
        data-testid="skeleton"
        data-skeleton-type="text"
        data-skeleton-size="large"
      />
    );
    
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('data-skeleton-type', 'text');
    expect(skeleton).toHaveAttribute('data-skeleton-size', 'large');
  });

  it('debería manejar onClick events', () => {
    const handleClick = vi.fn();
    render(<Skeleton onClick={handleClick} data-testid="skeleton" />);
    
    const skeleton = screen.getByTestId('skeleton');
    fireEvent.click(skeleton);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('debería ser focusable cuando tiene tabIndex', () => {
    render(<Skeleton tabIndex={0} data-testid="skeleton" />);
    
    const skeleton = screen.getByTestId('skeleton');
    skeleton.focus();
    expect(skeleton).toHaveFocus();
  });

  it('debería manejar children', () => {
    render(
      <Skeleton data-testid="skeleton">
        <span>Hidden content</span>
      </Skeleton>
    );
    
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
    // Los children pueden estar presentes pero ocultos por CSS
  });

  it('debería combinar className personalizada con clases base', () => {
    render(
      <Skeleton 
        className="w-20 h-4" 
        data-testid="skeleton" 
      />
    );
    
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('w-20', 'h-4');
    expect(skeleton).toHaveClass('animate-pulse', 'rounded-md', 'bg-muted');
  });

  it('debería manejar aria attributes', () => {
    render(
      <Skeleton 
        data-testid="skeleton"
        aria-label="Loading user profile"
        aria-busy="true"
      />
    );
    
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading user profile');
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
  });
}); 
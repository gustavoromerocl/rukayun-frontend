import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Avatar, AvatarImage, AvatarFallback } from '../avatar';

// Mock de cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('Avatar', () => {
  it('debería renderizar un avatar por defecto', () => {
    render(<Avatar data-testid="avatar" />);
    
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('data-slot', 'avatar');
  });

  it('debería aplicar className personalizada', () => {
    render(<Avatar className="custom-class" data-testid="avatar" />);
    
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveClass('custom-class');
  });

  it('debería pasar props adicionales al elemento', () => {
    render(
      <Avatar 
        data-testid="avatar"
        aria-label="User avatar"
        role="img"
      />
    );
    
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveAttribute('aria-label', 'User avatar');
    expect(avatar).toHaveAttribute('role', 'img');
  });

  it('debería manejar id attribute', () => {
    render(<Avatar id="avatar-id" data-testid="avatar" />);
    
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveAttribute('id', 'avatar-id');
  });

  it('debería manejar style attribute', () => {
    render(
      <Avatar 
        style={{ width: '40px', height: '40px' }} 
        data-testid="avatar" 
      />
    );
    
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveStyle({ width: '40px', height: '40px' });
  });

  it('debería manejar data attributes', () => {
    render(
      <Avatar 
        data-testid="avatar"
        data-avatar-size="large"
        data-avatar-type="user"
      />
    );
    
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveAttribute('data-avatar-size', 'large');
    expect(avatar).toHaveAttribute('data-avatar-type', 'user');
  });

  it('debería manejar onClick events', () => {
    const handleClick = vi.fn();
    render(
      <Avatar 
        onClick={handleClick} 
        data-testid="avatar"
      />
    );
    
    const avatar = screen.getByTestId('avatar');
    fireEvent.click(avatar);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('debería manejar onMouseEnter events', () => {
    const handleMouseEnter = vi.fn();
    render(
      <Avatar 
        onMouseEnter={handleMouseEnter} 
        data-testid="avatar"
      />
    );
    
    const avatar = screen.getByTestId('avatar');
    fireEvent.mouseEnter(avatar);
    
    expect(handleMouseEnter).toHaveBeenCalledTimes(1);
  });

  it('debería ser focusable cuando tiene tabIndex', () => {
    render(<Avatar tabIndex={0} data-testid="avatar" />);
    
    const avatar = screen.getByTestId('avatar');
    avatar.focus();
    expect(avatar).toHaveFocus();
  });

  it('debería manejar children', () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarImage src="/avatar.jpg" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toBeInTheDocument();
  });
});

describe('AvatarFallback', () => {
  it('debería renderizar un fallback de avatar', () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback data-testid="avatar-fallback">JD</AvatarFallback>
      </Avatar>
    );
    
    const avatarFallback = screen.getByTestId('avatar-fallback');
    expect(avatarFallback).toBeInTheDocument();
    expect(avatarFallback).toHaveAttribute('data-slot', 'avatar-fallback');
    expect(avatarFallback).toHaveTextContent('JD');
  });

  it('debería aplicar className personalizada', () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback 
          className="custom-class" 
          data-testid="avatar-fallback"
        >
          JD
        </AvatarFallback>
      </Avatar>
    );
    
    const avatarFallback = screen.getByTestId('avatar-fallback');
    expect(avatarFallback).toHaveClass('custom-class');
  });

  it('debería manejar children complejos', () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback data-testid="avatar-fallback">
          <span>J</span>
          <span>D</span>
        </AvatarFallback>
      </Avatar>
    );
    
    const avatarFallback = screen.getByTestId('avatar-fallback');
    expect(avatarFallback).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('debería manejar aria attributes', () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback 
          data-testid="avatar-fallback"
          aria-label="User initials"
          aria-describedby="user-info"
        >
          JD
        </AvatarFallback>
      </Avatar>
    );
    
    const avatarFallback = screen.getByTestId('avatar-fallback');
    expect(avatarFallback).toHaveAttribute('aria-label', 'User initials');
    expect(avatarFallback).toHaveAttribute('aria-describedby', 'user-info');
  });

  it('debería manejar role attribute', () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback 
          role="img" 
          data-testid="avatar-fallback"
        >
          JD
        </AvatarFallback>
      </Avatar>
    );
    
    const avatarFallback = screen.getByRole('img');
    expect(avatarFallback).toBeInTheDocument();
  });

  it('debería manejar onClick events', () => {
    const handleClick = vi.fn();
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback 
          onClick={handleClick}
          data-testid="avatar-fallback"
        >
          JD
        </AvatarFallback>
      </Avatar>
    );
    
    const avatarFallback = screen.getByTestId('avatar-fallback');
    fireEvent.click(avatarFallback);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('debería manejar onMouseEnter events', () => {
    const handleMouseEnter = vi.fn();
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback 
          onMouseEnter={handleMouseEnter}
          data-testid="avatar-fallback"
        >
          JD
        </AvatarFallback>
      </Avatar>
    );
    
    const avatarFallback = screen.getByTestId('avatar-fallback');
    fireEvent.mouseEnter(avatarFallback);
    
    expect(handleMouseEnter).toHaveBeenCalledTimes(1);
  });

  it('debería ser focusable cuando tiene tabIndex', () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback 
          tabIndex={0} 
          data-testid="avatar-fallback"
        >
          JD
        </AvatarFallback>
      </Avatar>
    );
    
    const avatarFallback = screen.getByTestId('avatar-fallback');
    avatarFallback.focus();
    expect(avatarFallback).toHaveFocus();
  });

  it('debería manejar data attributes', () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback 
          data-testid="avatar-fallback"
          data-fallback-type="initials"
          data-fallback-size="large"
        >
          JD
        </AvatarFallback>
      </Avatar>
    );
    
    const avatarFallback = screen.getByTestId('avatar-fallback');
    expect(avatarFallback).toHaveAttribute('data-fallback-type', 'initials');
    expect(avatarFallback).toHaveAttribute('data-fallback-size', 'large');
  });
}); 
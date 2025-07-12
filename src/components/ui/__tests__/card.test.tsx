import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from '../card';

// Mock de cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('Card Components', () => {
  describe('Card', () => {
    it('debería renderizar un card por defecto', () => {
      render(<Card>Card content</Card>);
      
      const card = screen.getByText('Card content');
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute('data-slot', 'card');
    });

    it('debería aplicar className personalizada', () => {
      render(<Card className="custom-class">Card content</Card>);
      
      const card = screen.getByText('Card content');
      expect(card).toHaveClass('custom-class');
    });

    it('debería pasar props adicionales', () => {
      render(<Card data-testid="test-card" aria-label="Test card">Card content</Card>);
      
      const card = screen.getByTestId('test-card');
      expect(card).toHaveAttribute('aria-label', 'Test card');
    });
  });

  describe('CardHeader', () => {
    it('debería renderizar un card header', () => {
      render(<CardHeader>Header content</CardHeader>);
      
      const header = screen.getByText('Header content');
      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute('data-slot', 'card-header');
    });

    it('debería aplicar className personalizada', () => {
      render(<CardHeader className="custom-header">Header content</CardHeader>);
      
      const header = screen.getByText('Header content');
      expect(header).toHaveClass('custom-header');
    });

    it('debería pasar props adicionales', () => {
      render(<CardHeader data-testid="test-header">Header content</CardHeader>);
      
      const header = screen.getByTestId('test-header');
      expect(header).toBeInTheDocument();
    });
  });

  describe('CardTitle', () => {
    it('debería renderizar un card title', () => {
      render(<CardTitle>Card Title</CardTitle>);
      
      const title = screen.getByText('Card Title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute('data-slot', 'card-title');
    });

    it('debería aplicar className personalizada', () => {
      render(<CardTitle className="custom-title">Card Title</CardTitle>);
      
      const title = screen.getByText('Card Title');
      expect(title).toHaveClass('custom-title');
    });

    it('debería pasar props adicionales', () => {
      render(<CardTitle data-testid="test-title">Card Title</CardTitle>);
      
      const title = screen.getByTestId('test-title');
      expect(title).toBeInTheDocument();
    });
  });

  describe('CardDescription', () => {
    it('debería renderizar un card description', () => {
      render(<CardDescription>Card Description</CardDescription>);
      
      const description = screen.getByText('Card Description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveAttribute('data-slot', 'card-description');
    });

    it('debería aplicar className personalizada', () => {
      render(<CardDescription className="custom-description">Card Description</CardDescription>);
      
      const description = screen.getByText('Card Description');
      expect(description).toHaveClass('custom-description');
    });

    it('debería pasar props adicionales', () => {
      render(<CardDescription data-testid="test-description">Card Description</CardDescription>);
      
      const description = screen.getByTestId('test-description');
      expect(description).toBeInTheDocument();
    });
  });

  describe('CardAction', () => {
    it('debería renderizar un card action', () => {
      render(<CardAction>Action content</CardAction>);
      
      const action = screen.getByText('Action content');
      expect(action).toBeInTheDocument();
      expect(action).toHaveAttribute('data-slot', 'card-action');
    });

    it('debería aplicar className personalizada', () => {
      render(<CardAction className="custom-action">Action content</CardAction>);
      
      const action = screen.getByText('Action content');
      expect(action).toHaveClass('custom-action');
    });

    it('debería pasar props adicionales', () => {
      render(<CardAction data-testid="test-action">Action content</CardAction>);
      
      const action = screen.getByTestId('test-action');
      expect(action).toBeInTheDocument();
    });
  });

  describe('CardContent', () => {
    it('debería renderizar un card content', () => {
      render(<CardContent>Content text</CardContent>);
      
      const content = screen.getByText('Content text');
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute('data-slot', 'card-content');
    });

    it('debería aplicar className personalizada', () => {
      render(<CardContent className="custom-content">Content text</CardContent>);
      
      const content = screen.getByText('Content text');
      expect(content).toHaveClass('custom-content');
    });

    it('debería pasar props adicionales', () => {
      render(<CardContent data-testid="test-content">Content text</CardContent>);
      
      const content = screen.getByTestId('test-content');
      expect(content).toBeInTheDocument();
    });
  });

  describe('CardFooter', () => {
    it('debería renderizar un card footer', () => {
      render(<CardFooter>Footer content</CardFooter>);
      
      const footer = screen.getByText('Footer content');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute('data-slot', 'card-footer');
    });

    it('debería aplicar className personalizada', () => {
      render(<CardFooter className="custom-footer">Footer content</CardFooter>);
      
      const footer = screen.getByText('Footer content');
      expect(footer).toHaveClass('custom-footer');
    });

    it('debería pasar props adicionales', () => {
      render(<CardFooter data-testid="test-footer">Footer content</CardFooter>);
      
      const footer = screen.getByTestId('test-footer');
      expect(footer).toBeInTheDocument();
    });
  });

  describe('Composición de componentes', () => {
    it('debería renderizar un card completo con todos los componentes', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
            <CardAction>Action</CardAction>
          </CardHeader>
          <CardContent>Main content</CardContent>
          <CardFooter>Footer content</CardFooter>
        </Card>
      );
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Main content')).toBeInTheDocument();
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('debería renderizar un card con solo header y content', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Simple Title</CardTitle>
          </CardHeader>
          <CardContent>Simple content</CardContent>
        </Card>
      );
      
      expect(screen.getByText('Simple Title')).toBeInTheDocument();
      expect(screen.getByText('Simple content')).toBeInTheDocument();
    });

    it('debería renderizar un card con solo content', () => {
      render(
        <Card>
          <CardContent>Only content</CardContent>
        </Card>
      );
      
      expect(screen.getByText('Only content')).toBeInTheDocument();
    });
  });

  describe('Accesibilidad', () => {
    it('debería mantener la estructura semántica', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Accessible Title</CardTitle>
            <CardDescription>Accessible Description</CardDescription>
          </CardHeader>
          <CardContent>Accessible content</CardContent>
        </Card>
      );
      
      const card = screen.getByText('Accessible content').closest('[data-slot="card"]');
      const header = screen.getByText('Accessible Title').closest('[data-slot="card-header"]');
      const content = screen.getByText('Accessible content').closest('[data-slot="card-content"]');
      
      expect(card).toBeInTheDocument();
      expect(header).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it('debería permitir atributos de accesibilidad', () => {
      render(
        <Card role="article" aria-label="Test card">
          <CardHeader>
            <CardTitle role="heading" aria-level={2}>Heading</CardTitle>
          </CardHeader>
          <CardContent role="main">Content</CardContent>
        </Card>
      );
      
      const card = screen.getByRole('article');
      const heading = screen.getByRole('heading', { level: 2 });
      const main = screen.getByRole('main');
      
      expect(card).toHaveAttribute('aria-label', 'Test card');
      expect(heading).toBeInTheDocument();
      expect(main).toBeInTheDocument();
    });
  });
}); 
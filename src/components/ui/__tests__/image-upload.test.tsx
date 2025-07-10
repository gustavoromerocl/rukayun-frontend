import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImageUpload } from '../image-upload';

// Mock de cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

// Mock de lucide-react
vi.mock('lucide-react', () => ({
  Upload: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="upload-icon" />
  ),
  X: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="x-icon" />
  ),
}));

// Mock de window.alert
const mockAlert = vi.fn();
global.alert = mockAlert;

// Mock de FileReader
const mockFileReader = {
  readAsDataURL: vi.fn(),
  onload: null as any,
  result: 'data:image/jpeg;base64,mock-base64-data',
};

global.FileReader = vi.fn(() => mockFileReader) as any;

describe('ImageUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFileReader.onload = null;
  });

  it('debería renderizar el componente por defecto', () => {
    render(<ImageUpload data-testid="image-upload" />);
    
    const uploadArea = screen.getByText('Arrastra una imagen aquí o haz clic para seleccionar');
    expect(uploadArea).toBeInTheDocument();
  });



  it('debería mostrar imagen cuando hay value', () => {
    const imageUrl = 'data:image/jpeg;base64,mock-data';
    render(<ImageUpload value={imageUrl} data-testid="image-upload" />);
    
    const image = screen.getByAltText('Preview');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', imageUrl);
  });



  it('debería manejar loading state', () => {
    const imageUrl = 'data:image/jpeg;base64,mock-data';
    render(<ImageUpload value={imageUrl} loading data-testid="image-upload" />);
    
    const removeButton = screen.getByRole('button');
    expect(removeButton).toBeDisabled();
  });

  it('debería manejar file input change', async () => {
    const handleChange = vi.fn();
    render(<ImageUpload onChange={handleChange} />);
    
    const uploadArea = screen.getByText('Arrastra una imagen aquí o haz clic para seleccionar');
    const file = new File(['mock-image'], 'test.jpg', { type: 'image/jpeg' });
    
    // Simular FileReader
    mockFileReader.onload = { target: { result: 'data:image/jpeg;base64,mock-data' } };
    
    fireEvent.click(uploadArea);
    
    // Simular selección de archivo
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      fireEvent.change(input, { target: { files: [file] } });
    }
    
    // Simular el callback de FileReader
    if (mockFileReader.onload) {
      mockFileReader.onload({ target: { result: 'data:image/jpeg;base64,mock-data' } });
    }
    
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('data:image/jpeg;base64,mock-data');
    });
  });

  it('debería validar tipo de archivo', () => {
    const handleChange = vi.fn();
    render(<ImageUpload onChange={handleChange} data-testid="image-upload" />);
    
    const file = new File(['mock-text'], 'test.txt', { type: 'text/plain' });
    
    // Simular selección de archivo inválido
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      fireEvent.change(input, { target: { files: [file] } });
    }
    
    expect(mockAlert).toHaveBeenCalledWith('Por favor selecciona un archivo de imagen válido.');
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('debería validar tamaño de archivo', () => {
    const handleChange = vi.fn();
    render(<ImageUpload onChange={handleChange} data-testid="image-upload" />);
    
    // Crear un archivo de más de 5MB
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    
    // Simular selección de archivo grande
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      fireEvent.change(input, { target: { files: [largeFile] } });
    }
    
    expect(mockAlert).toHaveBeenCalledWith('El archivo es demasiado grande. Máximo 5MB.');
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('debería manejar drag and drop', async () => {
    const handleChange = vi.fn();
    render(<ImageUpload onChange={handleChange} data-testid="image-upload" />);
    
    const uploadArea = screen.getByText('Arrastra una imagen aquí o haz clic para seleccionar');
    const file = new File(['mock-image'], 'test.jpg', { type: 'image/jpeg' });
    
    // Simular FileReader
    mockFileReader.onload = { target: { result: 'data:image/jpeg;base64,mock-data' } };
    
    fireEvent.dragOver(uploadArea);
    fireEvent.drop(uploadArea, { dataTransfer: { files: [file] } });
    
    // Simular el callback de FileReader
    if (mockFileReader.onload) {
      mockFileReader.onload({ target: { result: 'data:image/jpeg;base64,mock-data' } });
    }
    
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('data:image/jpeg;base64,mock-data');
    });
  });



  it('debería manejar remove para imagen local', () => {
    const handleChange = vi.fn();
    const imageUrl = 'data:image/jpeg;base64,mock-data';
    render(<ImageUpload value={imageUrl} onChange={handleChange} data-testid="image-upload" />);
    
    const removeButton = screen.getByRole('button');
    fireEvent.click(removeButton);
    
    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('debería manejar remove para imagen del servidor', () => {
    const handleRemove = vi.fn();
    const imageUrl = 'https://example.com/image.jpg';
    render(
      <ImageUpload 
        value={imageUrl} 
        onRemove={handleRemove} 
        isServerImage 
        data-testid="image-upload" 
      />
    );
    
    const removeButton = screen.getByRole('button');
    fireEvent.click(removeButton);
    
    expect(handleRemove).toHaveBeenCalled();
  });

  it('debería manejar click en área de upload', () => {
    render(<ImageUpload data-testid="image-upload" />);
    
    const uploadArea = screen.getByText('Arrastra una imagen aquí o haz clic para seleccionar');
    fireEvent.click(uploadArea);
    
    // El input file debería estar presente
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
  });

  it('debería mostrar icono de upload cuando no hay imagen', () => {
    render(<ImageUpload data-testid="image-upload" />);
    
    const uploadIcon = screen.getByTestId('upload-icon');
    expect(uploadIcon).toBeInTheDocument();
  });

  it('debería mostrar icono X cuando hay imagen', () => {
    const imageUrl = 'data:image/jpeg;base64,mock-data';
    render(<ImageUpload value={imageUrl} data-testid="image-upload" />);
    
    const xIcon = screen.getByTestId('x-icon');
    expect(xIcon).toBeInTheDocument();
  });

  it('debería manejar múltiples archivos en drop (solo el primero)', async () => {
    const handleChange = vi.fn();
    render(<ImageUpload onChange={handleChange} data-testid="image-upload" />);
    
    const uploadArea = screen.getByText('Arrastra una imagen aquí o haz clic para seleccionar');
    const file1 = new File(['mock-image-1'], 'test1.jpg', { type: 'image/jpeg' });
    const file2 = new File(['mock-image-2'], 'test2.jpg', { type: 'image/jpeg' });
    
    // Simular FileReader
    mockFileReader.onload = { target: { result: 'data:image/jpeg;base64,mock-data-1' } };
    
    fireEvent.drop(uploadArea, { dataTransfer: { files: [file1, file2] } });
    
    // Simular el callback de FileReader
    if (mockFileReader.onload) {
      mockFileReader.onload({ target: { result: 'data:image/jpeg;base64,mock-data-1' } });
    }
    
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('data:image/jpeg;base64,mock-data-1');
    });
  });

  it('debería manejar archivo vacío en drop', () => {
    const handleChange = vi.fn();
    render(<ImageUpload onChange={handleChange} data-testid="image-upload" />);
    
    const uploadArea = screen.getByText('Arrastra una imagen aquí o haz clic para seleccionar');
    
    fireEvent.drop(uploadArea, { dataTransfer: { files: [] } });
    
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('debería manejar disabled en remove button', () => {
    const imageUrl = 'data:image/jpeg;base64,mock-data';
    render(<ImageUpload value={imageUrl} disabled data-testid="image-upload" />);
    
    const removeButton = screen.getByRole('button');
    expect(removeButton).toBeDisabled();
  });

  it('debería manejar loading en remove button', () => {
    const imageUrl = 'data:image/jpeg;base64,mock-data';
    render(<ImageUpload value={imageUrl} loading data-testid="image-upload" />);
    
    const removeButton = screen.getByRole('button');
    expect(removeButton).toBeDisabled();
  });

  it('debería mostrar spinner cuando está loading', () => {
    const imageUrl = 'data:image/jpeg;base64,mock-data';
    render(<ImageUpload value={imageUrl} loading data-testid="image-upload" />);
    
    const spinner = screen.getByRole('button').querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('debería manejar onRemove cuando no es imagen del servidor', () => {
    const handleRemove = vi.fn();
    const handleChange = vi.fn();
    const imageUrl = 'data:image/jpeg;base64,mock-data';
    render(
      <ImageUpload 
        value={imageUrl} 
        onRemove={handleRemove}
        onChange={handleChange}
        data-testid="image-upload" 
      />
    );
    
    const removeButton = screen.getByRole('button');
    fireEvent.click(removeButton);
    
    expect(handleRemove).not.toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledWith('');
  });
}); 
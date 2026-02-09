import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../test-utils';
import CreateEventModal from '../../src/components/CreateEventModal';
import * as apiClient from '../../src/adapter/api/useApiClient';

// Mock the API client
vi.mock('../../src/adapter/api/useApiClient');

describe('CreateEventModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when closed', () => {
    render(<CreateEventModal isOpen={false} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    expect(screen.queryByText(/neues event erstellen/i)).not.toBeInTheDocument();
  });

  it('should render when open', () => {
    render(<CreateEventModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    expect(screen.getByText(/neues event erstellen/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/titel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ort/i)).toBeInTheDocument();
  });

  it('should close modal when cancel button is clicked', () => {
    render(<CreateEventModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    const cancelButton = screen.getByText(/abbrechen/i);
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});

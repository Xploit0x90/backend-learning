import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../test-utils';
import CreateTagModal from '../../src/components/CreateTagModal';

vi.mock('../../src/adapter/api/useApiClient');

describe('CreateTagModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when closed', () => {
    render(<CreateTagModal isOpen={false} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    expect(screen.queryByText(/neuen tag erstellen/i)).not.toBeInTheDocument();
  });

  it('should render when open', () => {
    render(<CreateTagModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    expect(screen.getByText(/neuen tag erstellen/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tag-name/i)).toBeInTheDocument();
  });

  it('should close modal when cancel button is clicked', () => {
    render(<CreateTagModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    const cancelButton = screen.getByText(/abbrechen/i);
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});

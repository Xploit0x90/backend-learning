import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../test-utils';
import CreateParticipantModal from '../../src/components/CreateParticipantModal';

vi.mock('../../src/adapter/api/useApiClient');

describe('CreateParticipantModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when closed', () => {
    render(<CreateParticipantModal isOpen={false} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    expect(screen.queryByText(/neuen teilnehmer hinzufügen/i)).not.toBeInTheDocument();
  });

  it('should render when open', () => {
    render(<CreateParticipantModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    expect(screen.getByText(/neuen teilnehmer hinzufügen/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/vorname/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nachname/i)).toBeInTheDocument();
  });

  it('should close modal when cancel button is clicked', () => {
    render(<CreateParticipantModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    const cancelButton = screen.getByText(/abbrechen/i);
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});

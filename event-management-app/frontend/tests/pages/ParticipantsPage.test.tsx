import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../test-utils';
import ParticipantsPage from '../../src/pages/ParticipantsPage';
import * as apiClient from '../../src/adapter/api/useApiClient';

// Mock the API client
vi.mock('../../src/adapter/api/useApiClient');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('ParticipantsPage', () => {
  const mockParticipants = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
      study_program: 'Informatik',
      notes: 'Test participant',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      phone: '987654321',
      study_program: null,
      notes: null,
      created_at: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    vi.mocked(apiClient.getAllParticipants).mockImplementation(
      () => new Promise(() => {}) // Never resolves to keep loading
    );

    render(<ParticipantsPage />);
    expect(screen.getByText(/lade teilnehmer/i)).toBeInTheDocument();
  });

  it('should display participants after loading', async () => {
    vi.mocked(apiClient.getAllParticipants).mockResolvedValue(mockParticipants);

    render(<ParticipantsPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('should display error message when API call fails', async () => {
    vi.mocked(apiClient.getAllParticipants).mockRejectedValue(new Error('API Error'));

    render(<ParticipantsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Fehler beim Laden der Teilnehmer/i)).toBeInTheDocument();
    });
  });

  it('should filter participants by search query', async () => {
    vi.mocked(apiClient.getAllParticipants).mockResolvedValue(mockParticipants);

    render(<ParticipantsPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/suche/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('should open create participant modal when button is clicked', async () => {
    vi.mocked(apiClient.getAllParticipants).mockResolvedValue(mockParticipants);

    render(<ParticipantsPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Button text is i18n: "New participant" (en) or "Neuer Teilnehmer" (de)
    const createButton = screen.getByRole('button', { name: /new participant|neuer teilnehmer/i });
    fireEvent.click(createButton);

    await waitFor(() => {
      // Modal title is i18n: "Add new participant" (en) or "Neuen Teilnehmer hinzufügen" (de)
      expect(screen.getByText(/add new participant|neuen teilnehmer hinzufügen/i)).toBeInTheDocument();
    });
  });

  it('should display participant statistics', async () => {
    vi.mocked(apiClient.getAllParticipants).mockResolvedValue(mockParticipants);

    render(<ParticipantsPage />);

    await waitFor(() => {
      // Check for total participants count in stats bar
      const statValues = screen.getAllByText(/2/i);
      expect(statValues.length).toBeGreaterThan(0);
    });
  });
});


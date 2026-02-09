import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../test-utils';
import EventDetailPage from '../../src/pages/EventDetailPage';
import * as apiClient from '../../src/adapter/api/useApiClient';

// Mock the API client
vi.mock('../../src/adapter/api/useApiClient');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => vi.fn(),
  };
});

describe('EventDetailPage', () => {
  const mockEvent = {
    id: 1,
    title: 'Test Event',
    description: 'Test Description',
    location: 'Berlin',
    date: new Date('2025-12-31T10:00:00').toISOString(),
    max_participants: 50,
    participant_count: 2,
    image_url: null,
    tags: [
      { id: 1, name: 'Workshop', color: '#FF5733' },
    ],
    participants: [
      {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
      },
    ],
  };

  const mockParticipants = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
    },
  ];

  const mockTags = [
    { id: 1, name: 'Workshop', color: '#FF5733' },
    { id: 2, name: 'Hackathon', color: '#33FF57' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    vi.mocked(apiClient.getEventById).mockImplementation(
      () => new Promise(() => {}) // Never resolves to keep loading
    );

    render(<EventDetailPage />);
    expect(screen.getByText(/lade event/i)).toBeInTheDocument();
  });

  it('should display event details after loading', async () => {
    vi.mocked(apiClient.getEventById).mockResolvedValue(mockEvent);
    vi.mocked(apiClient.getAllParticipants).mockResolvedValue(mockParticipants);
    vi.mocked(apiClient.getAllTags).mockResolvedValue(mockTags);

    render(<EventDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Berlin')).toBeInTheDocument();
    });
  });

  it('should display error message when event not found', async () => {
    vi.mocked(apiClient.getEventById).mockRejectedValue(new Error('Event not found'));
    vi.mocked(apiClient.getAllParticipants).mockResolvedValue(mockParticipants);
    vi.mocked(apiClient.getAllTags).mockResolvedValue(mockTags);

    render(<EventDetailPage />);

    await waitFor(() => {
      expect(screen.getByText(/event nicht gefunden/i)).toBeInTheDocument();
    });
  });

  it('should display event participants', async () => {
    vi.mocked(apiClient.getEventById).mockResolvedValue(mockEvent);
    vi.mocked(apiClient.getAllParticipants).mockResolvedValue(mockParticipants);
    vi.mocked(apiClient.getAllTags).mockResolvedValue(mockTags);

    render(<EventDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('should display event tags', async () => {
    vi.mocked(apiClient.getEventById).mockResolvedValue(mockEvent);
    vi.mocked(apiClient.getAllParticipants).mockResolvedValue(mockParticipants);
    vi.mocked(apiClient.getAllTags).mockResolvedValue(mockTags);

    render(<EventDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Workshop')).toBeInTheDocument();
    });
  });
});


// Event Type
export interface Event {
    id: number;
    title: string;
    description?: string;
    location: string;
    date: string;
    image_url?: string;
    max_participants: number;
    created_at: string;
    updated_at: string;
    participant_count?: number;
    tags?: Tag[];
    participants?: Participant[];
  }
  
  // Participant Type
  export interface Participant {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    study_program?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    event_count?: number;
    events?: Event[];
    registered_at?: string;
  }
  
  // Tag Type
  export interface Tag {
    id: number;
    name: string;
    color: string;
    created_at: string;
    event_count?: number;
    events?: Event[];
  }
  
  // API Response Types
  export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
  }

  // Weather Type
  export interface Weather {
    location: string;
    country: string;
    temperature: number;
    feelsLike: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    condition: string;
  }
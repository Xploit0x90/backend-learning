import axios from 'axios';
import { Event, Participant, Tag, ApiResponse, Weather } from '../../types';

// In dev: use same origin so Vite proxy forwards /api to backend (avoids CORS).
// In prod: use full backend URL from env.
const API_BASE_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== EVENTS ====================

export const getAllEvents = async (): Promise<Event[]> => {
  const response = await api.get<ApiResponse<Event[]>>('/api/events');
  return response.data.data || [];
};

export const getEventById = async (id: number): Promise<Event | null> => {
  const response = await api.get<ApiResponse<Event>>(`/api/events/${id}`);
  return response.data.data || null;
};

export const createEvent = async (eventData: Partial<Event>): Promise<Event> => {
  const response = await api.post<ApiResponse<Event>>('/api/events', eventData);
  return response.data.data!;
};

export const updateEvent = async (id: number, eventData: Partial<Event>): Promise<Event> => {
  const response = await api.put<ApiResponse<Event>>(`/api/events/${id}`, eventData);
  return response.data.data!;
};

export const deleteEvent = async (id: number): Promise<void> => {
  await api.delete(`/api/events/${id}`);
};

// ==================== PARTICIPANTS ====================

export const getAllParticipants = async (): Promise<Participant[]> => {
  const response = await api.get<ApiResponse<Participant[]>>('/api/participants');
  return response.data.data || [];
};

export const getParticipantById = async (id: number): Promise<Participant | null> => {
  const response = await api.get<ApiResponse<Participant>>(`/api/participants/${id}`);
  return response.data.data || null;
};

export const createParticipant = async (participantData: Partial<Participant>): Promise<Participant> => {
  const response = await api.post<ApiResponse<Participant>>('/api/participants', participantData);
  return response.data.data!;
};

export const updateParticipant = async (id: number, participantData: Partial<Participant>): Promise<Participant> => {
  const response = await api.put<ApiResponse<Participant>>(`/api/participants/${id}`, participantData);
  return response.data.data!;
};

export const deleteParticipant = async (id: number): Promise<void> => {
  await api.delete(`/api/participants/${id}`);
};

export const addParticipantToEvent = async (participantId: number, eventId: number): Promise<void> => {
  await api.post('/api/participants/add-to-event', { participantId, eventId });
};

export const removeParticipantFromEvent = async (participantId: number, eventId: number): Promise<void> => {
  await api.delete(`/api/participants/${participantId}/events/${eventId}`);
};

// ==================== TAGS ====================

export const getAllTags = async (): Promise<Tag[]> => {
  const response = await api.get<ApiResponse<Tag[]>>('/api/tags');
  return response.data.data || [];
};

export const getTagById = async (id: number): Promise<Tag | null> => {
  const response = await api.get<ApiResponse<Tag>>(`/api/tags/${id}`);
  return response.data.data || null;
};

export const createTag = async (tagData: Partial<Tag>): Promise<Tag> => {
  const response = await api.post<ApiResponse<Tag>>('/api/tags', tagData);
  return response.data.data!;
};

export const updateTag = async (id: number, tagData: Partial<Tag>): Promise<Tag> => {
  const response = await api.put<ApiResponse<Tag>>(`/api/tags/${id}`, tagData);
  return response.data.data!;
};

export const deleteTag = async (id: number): Promise<void> => {
  await api.delete(`/api/tags/${id}`);
};

export const addTagToEvent = async (tagId: number, eventId: number): Promise<void> => {
  await api.post('/api/tags/add-to-event', { tagId, eventId });
};

export const removeTagFromEvent = async (tagId: number, eventId: number): Promise<void> => {
  await api.delete(`/api/tags/${tagId}/events/${eventId}`);
};

// ==================== WEATHER ====================

export const getWeather = async (location: string, date?: string): Promise<Weather> => {
  const params: any = { location };
  if (date) params.date = date;
  
  const response = await api.get<ApiResponse<Weather>>('/api/weather', { params });
  return response.data.data!;
};

export default api;
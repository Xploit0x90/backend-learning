import axios from 'axios';
import { Event, Participant, Tag, ApiResponse, Weather } from '../../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== EVENTS ====================

export const getAllEvents = async (): Promise<Event[]> => {
  const response = await api.get<ApiResponse<Event[]>>('/events');
  return response.data.data || [];
};

export const getEventById = async (id: number): Promise<Event | null> => {
  const response = await api.get<ApiResponse<Event>>(`/events/${id}`);
  return response.data.data || null;
};

export const createEvent = async (eventData: Partial<Event>): Promise<Event> => {
  const response = await api.post<ApiResponse<Event>>('/events', eventData);
  return response.data.data!;
};

export const updateEvent = async (id: number, eventData: Partial<Event>): Promise<Event> => {
  const response = await api.put<ApiResponse<Event>>(`/events/${id}`, eventData);
  return response.data.data!;
};

export const deleteEvent = async (id: number): Promise<void> => {
  await api.delete(`/events/${id}`);
};

// ==================== PARTICIPANTS ====================

export const getAllParticipants = async (): Promise<Participant[]> => {
  const response = await api.get<ApiResponse<Participant[]>>('/participants');
  return response.data.data || [];
};

export const getParticipantById = async (id: number): Promise<Participant | null> => {
  const response = await api.get<ApiResponse<Participant>>(`/participants/${id}`);
  return response.data.data || null;
};

export const createParticipant = async (participantData: Partial<Participant>): Promise<Participant> => {
  const response = await api.post<ApiResponse<Participant>>('/participants', participantData);
  return response.data.data!;
};

export const updateParticipant = async (id: number, participantData: Partial<Participant>): Promise<Participant> => {
  const response = await api.put<ApiResponse<Participant>>(`/participants/${id}`, participantData);
  return response.data.data!;
};

export const deleteParticipant = async (id: number): Promise<void> => {
  await api.delete(`/participants/${id}`);
};

export const addParticipantToEvent = async (participantId: number, eventId: number): Promise<void> => {
  await api.post('/participants/add-to-event', { participantId, eventId });
};

export const removeParticipantFromEvent = async (participantId: number, eventId: number): Promise<void> => {
  await api.delete(`/participants/${participantId}/events/${eventId}`);
};

// ==================== TAGS ====================

export const getAllTags = async (): Promise<Tag[]> => {
  const response = await api.get<ApiResponse<Tag[]>>('/tags');
  return response.data.data || [];
};

export const getTagById = async (id: number): Promise<Tag | null> => {
  const response = await api.get<ApiResponse<Tag>>(`/tags/${id}`);
  return response.data.data || null;
};

export const createTag = async (tagData: Partial<Tag>): Promise<Tag> => {
  const response = await api.post<ApiResponse<Tag>>('/tags', tagData);
  return response.data.data!;
};

export const updateTag = async (id: number, tagData: Partial<Tag>): Promise<Tag> => {
  const response = await api.put<ApiResponse<Tag>>(`/tags/${id}`, tagData);
  return response.data.data!;
};

export const deleteTag = async (id: number): Promise<void> => {
  await api.delete(`/tags/${id}`);
};

export const addTagToEvent = async (tagId: number, eventId: number): Promise<void> => {
  await api.post('/tags/add-to-event', { tagId, eventId });
};

export const removeTagFromEvent = async (tagId: number, eventId: number): Promise<void> => {
  await api.delete(`/tags/${tagId}/events/${eventId}`);
};

// ==================== WEATHER ====================

export const getWeather = async (location: string, date?: string): Promise<Weather> => {
  const params: any = { location };
  if (date) params.date = date;
  
  const response = await api.get<ApiResponse<Weather>>('/weather', { params });
  return response.data.data!;
};

export default api;
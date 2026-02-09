import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import ParticipantsPage from './pages/ParticipantsPage';
import TagsPage from './pages/TagsPage';
import EventDetailPage from './pages/EventDetailPage';
import ParticipantDetailPage from './pages/ParticipantDetailPage';
import TagDetailPage from './pages/TagDetailPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:id" element={<EventDetailPage />} />
      <Route path="/participants" element={<ParticipantsPage />} />
      <Route path="/participants/:id" element={<ParticipantDetailPage />} />
      <Route path="/tags" element={<TagsPage />} />
      <Route path="/tags/:id" element={<TagDetailPage />} />
    </Routes>
  );
};


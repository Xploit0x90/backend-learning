import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Spinner } from '@chakra-ui/react';

const HomePage = lazy(() => import('./pages/HomePage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const ParticipantDetailPage = lazy(() => import('./pages/ParticipantDetailPage'));
const ParticipantsPage = lazy(() => import('./pages/ParticipantsPage'));
const TagDetailPage = lazy(() => import('./pages/TagDetailPage'));
const TagsPage = lazy(() => import('./pages/TagsPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));

const PageFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
    <Spinner size="xl" thickness="3px" />
  </Box>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageFallback />}>
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
    </Suspense>
  );
};


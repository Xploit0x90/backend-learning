import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTagById } from '../adapter/api/useApiClient';
import { Tag, Event } from '../types';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Tag as TagIcon } from 'lucide-react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Card,
  VStack,
  HStack,
  Icon,
  Badge,
  Alert,
  AlertIcon,
  Spinner,
  Grid,
} from '@chakra-ui/react';

const TagDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [tag, setTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Check dark mode from body class
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.body.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Color values
  const cardBg = isDark ? 'rgba(50, 48, 46, 0.7)' : 'rgba(255, 255, 255, 0.7)';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(204, 197, 185, 0.3)';
  const cardShadow = isDark ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.08)';
  const titleColor = isDark ? '#d4d2ce' : '#252422';
  const textColor = isDark ? '#d4d2ce' : '#403D39';

  useEffect(() => {
    loadTagDetails();
  }, [id]);

  const loadTagDetails = async () => {
    try {
      setLoading(true);
      const data = await getTagById(Number(id));
      // Debug: Log event data to check participant_count
      if (data?.events) {
        console.log('Tag events with participant counts:', data.events.map(e => ({
          id: e.id,
          title: e.title,
          participant_count: e.participant_count,
          participants_length: e.participants?.length,
          participants: e.participants
        })));
      }
      setTag(data);
      setError(null);
    } catch (err) {
      setError('Tag nicht gefunden');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isEventPast = (eventDate: string): boolean => {
    return new Date(eventDate) < new Date();
  };

  const isEventUpcoming = (eventDate: string): boolean => {
    return new Date(eventDate) >= new Date();
  };

  if (loading) {
    return (
      <Box textAlign="center" padding="60px">
        <Spinner size="xl" color="#EB5E28" />
        <Text mt="20px" fontSize="18px" color={textColor}>Lade Tag...</Text>
      </Box>
    );
  }

  if (error || !tag) {
    return (
      <VStack spacing="20px">
        <Alert status="error" borderRadius="12px">
          <AlertIcon />
          {error || 'Tag nicht gefunden'}
        </Alert>
        <Button
          leftIcon={<Icon as={ArrowLeft} boxSize="18px" />}
          onClick={() => navigate('/tags')}
          bg="#EB5E28"
          color="white"
          _hover={{ bg: '#d94d1a' }}
        >
          Zurück zur Übersicht
        </Button>
      </VStack>
    );
  }

  const events = tag.events || [];
  const pastEvents = events.filter(event => isEventPast(event.date));
  const upcomingEvents = events.filter(event => isEventUpcoming(event.date));

  return (
    <Box animation="fadeIn 0.5s ease">
      {/* Header */}
      <Card
        bg={cardBg}
        border={`1px solid ${cardBorder}`}
        boxShadow={cardShadow}
        backdropFilter="blur(20px)"
        borderRadius="20px"
        padding="30px"
        mb="20px"
      >
        <Button
          leftIcon={<Icon as={ArrowLeft} boxSize="20px" />}
          onClick={() => navigate('/tags')}
          bg="rgba(235, 94, 40, 0.1)"
          color="#EB5E28"
          _hover={{ bg: 'rgba(235, 94, 40, 0.2)' }}
          borderRadius="12px"
          mb="20px"
        >
          Zurück zu Tags
        </Button>
        <Flex alignItems="center" gap="24px" flexWrap="wrap">
          <Box
            width="80px"
            height="80px"
            borderRadius="20px"
            bg={tag.color}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            boxShadow={`0 8px 24px ${tag.color}40`}
          >
            <Icon as={TagIcon} boxSize="32px" />
          </Box>
          <VStack align="flex-start" spacing="12px" flex="1" minWidth="0">
            <Heading fontSize="36px" fontWeight={800} color={titleColor}>
              {tag.name}
            </Heading>
            <HStack spacing="16px" fontSize="15px" color={textColor}>
              <HStack spacing="6px">
                <Text fontWeight={600} color={tag.color}>
                  {tag.color.toUpperCase()}
                </Text>
              </HStack>
              <HStack spacing="6px">
                <Icon as={Calendar} boxSize="16px" color="#EB5E28" />
                <Text>{events.length} Event{events.length !== 1 ? 's' : ''}</Text>
              </HStack>
            </HStack>
          </VStack>
        </Flex>
      </Card>

      {/* Tag Info Card */}
      <Card
        bg={cardBg}
        border={`1px solid ${cardBorder}`}
        boxShadow={cardShadow}
        backdropFilter="blur(20px)"
        borderRadius="20px"
        padding="30px"
        mb="20px"
      >
        <Heading fontSize="24px" fontWeight={700} color={titleColor} mb="20px">
          Tag-Informationen
        </Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="20px">
          <VStack align="flex-start" spacing="4px">
            <Text fontSize="12px" fontWeight={600} color={textColor} opacity={0.7} textTransform="uppercase">
              Name
            </Text>
            <Text fontSize="16px" color={titleColor} fontWeight={600}>
              {tag.name}
            </Text>
          </VStack>
          <VStack align="flex-start" spacing="4px">
            <Text fontSize="12px" fontWeight={600} color={textColor} opacity={0.7} textTransform="uppercase">
              Farbe
            </Text>
            <HStack spacing="8px">
              <Box
                width="24px"
                height="24px"
                borderRadius="6px"
                bg={tag.color}
                border={`2px solid ${cardBorder}`}
              />
              <Text fontSize="16px" color={titleColor} fontWeight={600}>
                {tag.color.toUpperCase()}
              </Text>
            </HStack>
          </VStack>
          <VStack align="flex-start" spacing="4px">
            <Text fontSize="12px" fontWeight={600} color={textColor} opacity={0.7} textTransform="uppercase">
              Anzahl Events
            </Text>
            <Text fontSize="16px" color={titleColor} fontWeight={600}>
              {events.length}
            </Text>
          </VStack>
          {tag.created_at && (
            <VStack align="flex-start" spacing="4px">
              <Text fontSize="12px" fontWeight={600} color={textColor} opacity={0.7} textTransform="uppercase">
                Erstellt am
              </Text>
              <Text fontSize="16px" color={titleColor} fontWeight={600}>
                {new Date(tag.created_at).toLocaleDateString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </VStack>
          )}
        </Grid>
      </Card>

      {/* Events Section */}
      <Card
        bg={cardBg}
        border={`1px solid ${cardBorder}`}
        boxShadow={cardShadow}
        backdropFilter="blur(20px)"
        borderRadius="20px"
        padding="30px"
      >
        <Flex justifyContent="space-between" alignItems="center" mb="20px" flexWrap="wrap" gap="12px">
          <Heading fontSize="24px" fontWeight={700} color={titleColor} display="flex" alignItems="center" gap="12px">
            <Icon as={Calendar} boxSize="24px" />
            Events ({events.length})
          </Heading>
          <HStack spacing="12px">
            <Badge
              bg="#10B981"
              color="white"
              padding="6px 12px"
              borderRadius="8px"
              fontSize="12px"
              fontWeight={600}
            >
              {upcomingEvents.length} Kommend
            </Badge>
            <Badge
              bg="#6B7280"
              color="white"
              padding="6px 12px"
              borderRadius="8px"
              fontSize="12px"
              fontWeight={600}
            >
              {pastEvents.length} Vergangen
            </Badge>
          </HStack>
        </Flex>

        {events.length === 0 ? (
          <Box textAlign="center" padding="60px">
            <Icon as={Calendar} boxSize="48px" opacity={0.3} mb="16px" />
            <Text fontSize="16px" color={textColor}>
              Diesem Tag sind noch keine Events zugeordnet.
            </Text>
          </Box>
        ) : (
          <VStack align="stretch" spacing="24px">
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <Box>
                <HStack spacing="8px" mb="16px">
                  <Box width="8px" height="8px" borderRadius="50%" bg="#10B981" />
                  <Heading fontSize="20px" fontWeight={700} color={titleColor}>
                    Kommende Events ({upcomingEvents.length})
                  </Heading>
                </HStack>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="16px">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} isPast={false} cardBg={cardBg} cardBorder={cardBorder} cardShadow={cardShadow} titleColor={titleColor} textColor={textColor} />
                  ))}
                </Grid>
              </Box>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <Box>
                <HStack spacing="8px" mb="16px">
                  <Box width="8px" height="8px" borderRadius="50%" bg="#6B7280" />
                  <Heading fontSize="20px" fontWeight={700} color={titleColor}>
                    Vergangene Events ({pastEvents.length})
                  </Heading>
                </HStack>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="16px">
                  {pastEvents.map((event) => (
                    <EventCard key={event.id} event={event} isPast={true} cardBg={cardBg} cardBorder={cardBorder} cardShadow={cardShadow} titleColor={titleColor} textColor={textColor} />
                  ))}
                </Grid>
              </Box>
            )}
          </VStack>
        )}
      </Card>
    </Box>
  );
};

// Event Card Component
interface EventCardProps {
  event: Event;
  isPast: boolean;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  titleColor: string;
  textColor: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, isPast, cardBg, cardBorder, cardShadow, titleColor, textColor }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box
      as={Link}
      to={`/events/${event.id}`}
      textDecoration="none"
      _hover={{ textDecoration: 'none' }}
    >
      <Card
        bg={cardBg}
        border={`1px solid ${cardBorder}`}
        boxShadow={cardShadow}
        backdropFilter="blur(20px)"
        borderRadius="16px"
        padding="20px"
        cursor="pointer"
        transition="all 0.3s ease"
        _hover={{
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
          borderColor: isPast ? '#6B7280' : '#10B981',
        }}
        position="relative"
        overflow="hidden"
      >
        {event.image_url ? (
          <Box
            width="calc(100% + 40px)"
            height={{ base: '180px', md: '200px', lg: '220px' }}
            overflow="hidden"
            bg="rgba(204, 197, 185, 0.1)"
            margin="-20px -20px 20px -20px"
            position="relative"
            borderTopRadius="16px"
            sx={{
              '@media (max-width: 768px)': {
                margin: '-20px -20px 16px -20px',
                width: 'calc(100% + 40px)',
              },
            }}
          >
            <Box
              as="img"
              src={event.image_url}
              alt={event.title}
              width="100%"
              height="100%"
              objectFit="cover"
              display="block"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <Box
              position="absolute"
              bottom="12px"
              left="12px"
              bg="linear-gradient(135deg, #EB5E28 0%, #d94d1a 100%)"
              borderRadius="10px"
              padding="8px 12px"
              color="white"
            >
              <Text fontSize="11px" fontWeight={600} textTransform="uppercase">
                {new Date(event.date).toLocaleDateString('de-DE', { month: 'short' })}
              </Text>
              <Text fontSize="20px" fontWeight={800} lineHeight="1">
                {new Date(event.date).getDate()}
              </Text>
            </Box>
          </Box>
        ) : (
          <HStack spacing="12px" mb="16px">
            <Box
              bg="linear-gradient(135deg, #EB5E28 0%, #d94d1a 100%)"
              borderRadius="10px"
              padding="12px"
              color="white"
              minWidth="60px"
              textAlign="center"
            >
              <Text fontSize="11px" fontWeight={600} textTransform="uppercase">
                {new Date(event.date).toLocaleDateString('de-DE', { month: 'short' })}
              </Text>
              <Text fontSize="24px" fontWeight={800} lineHeight="1">
                {new Date(event.date).getDate()}
              </Text>
            </Box>
          </HStack>
        )}
        <VStack align="stretch" spacing="12px">
          <Heading fontSize="18px" fontWeight={700} color={titleColor} noOfLines={2}>
            {event.title}
          </Heading>
          <VStack align="stretch" spacing="6px" fontSize="13px" color={textColor}>
            <HStack spacing="6px">
              <Icon as={MapPin} boxSize="16px" color="#EB5E28" />
              <Text>{event.location}</Text>
            </HStack>
            <HStack spacing="6px">
              <Icon as={Clock} boxSize="16px" color="#EB5E28" />
              <Text>{formatDate(event.date)} um {formatTime(event.date)}</Text>
            </HStack>
            <HStack spacing="6px">
              <Icon as={Users} boxSize="14px" color="#EB5E28" />
              <Text>
                {typeof event.participant_count === 'number' 
                  ? event.participant_count 
                  : (event.participants?.length ?? 0)} / {event.max_participants} Teilnehmer
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Card>
    </Box>
  );
};

export default TagDetailPage;

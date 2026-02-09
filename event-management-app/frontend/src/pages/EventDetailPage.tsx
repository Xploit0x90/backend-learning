import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, getAllParticipants, getAllTags, addParticipantToEvent, removeParticipantFromEvent, addTagToEvent, removeTagFromEvent, deleteEvent, getWeather } from '../adapter/api/useApiClient';
import { Event, Participant, Tag, Weather } from '../types';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Edit2, Trash2, Plus, X, Cloud, Droplets, Wind } from 'lucide-react';
import EditEventModal from '../components/EditEventModal';
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
  Avatar,
  Alert,
  AlertIcon,
  Spinner,
  useToast,
} from '@chakra-ui/react';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [allParticipants, setAllParticipants] = useState<Participant[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
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
    loadEventDetails();
    loadAllParticipantsAndTags();
  }, [id]);

  useEffect(() => {
    if (event?.location) {
      loadWeather();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.location]);

  const loadEventDetails = async () => {
    try {
      setLoading(true);
      const data = await getEventById(Number(id));
      setEvent(data);
      setError(null);
    } catch (err) {
      setError('Event nicht gefunden');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllParticipantsAndTags = async () => {
    try {
      const [participants, tags] = await Promise.all([
        getAllParticipants(),
        getAllTags(),
      ]);
      setAllParticipants(participants);
      setAllTags(tags);
    } catch (err) {
      console.error(err);
    }
  };

  const loadWeather = async () => {
    if (!event?.location) return;
    
    try {
      setWeatherLoading(true);
      setError(null);
      const eventDate = event.date ? new Date(event.date).toISOString().split('T')[0] : undefined;
      const weatherData = await getWeather(event.location, eventDate);
      setWeather(weatherData);
    } catch (err: any) {
      console.error('Error loading weather:', err);
      if (err.response?.status === 500 && (
        err.response?.data?.message?.includes('Weather API key not configured') ||
        err.response?.data?.message?.includes('Wetter-API-Schlüssel nicht konfiguriert')
      )) {
        setError('Wetter-API-Schlüssel nicht konfiguriert. Bitte WEATHER_API_KEY in backend/.env hinzufügen.');
      } else {
        setWeather(null);
      }
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleAddParticipant = async (participantId: number) => {
    try {
      await addParticipantToEvent(participantId, Number(id));
      loadEventDetails();
      setShowAddParticipant(false);
      toast({
        title: 'Teilnehmer hinzugefügt',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast({
          title: 'Fehler',
          description: 'Teilnehmer ist bereits angemeldet',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Fehler',
          description: 'Fehler beim Hinzufügen',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleRemoveParticipant = async (participantId: number) => {
    if (window.confirm('Teilnehmer wirklich vom Event entfernen?')) {
      try {
        await removeParticipantFromEvent(participantId, Number(id));
        loadEventDetails();
        toast({
          title: 'Teilnehmer entfernt',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: 'Fehler',
          description: 'Fehler beim Entfernen',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleAddTag = async (tagId: number) => {
    try {
      await addTagToEvent(tagId, Number(id));
      loadEventDetails();
      setShowAddTag(false);
      toast({
        title: 'Tag hinzugefügt',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast({
          title: 'Fehler',
          description: 'Tag ist bereits zugewiesen',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Fehler',
          description: 'Fehler beim Hinzufügen',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleRemoveTag = async (tagId: number) => {
    try {
      await removeTagFromEvent(tagId, Number(id));
      loadEventDetails();
      toast({
        title: 'Tag entfernt',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Fehler',
        description: 'Fehler beim Entfernen',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteEvent = async () => {
    if (!event) return;
    if (window.confirm(`Event "${event.title}" wirklich löschen?`)) {
      try {
        await deleteEvent(Number(id));
        navigate('/events');
        toast({
          title: 'Event gelöscht',
          description: `"${event.title}" wurde erfolgreich gelöscht`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: 'Fehler',
          description: 'Fehler beim Löschen des Events',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" padding="60px">
        <Spinner size="xl" color="#EB5E28" />
        <Text mt="20px" fontSize="18px" color={textColor}>Lade Event...</Text>
      </Box>
    );
  }

  if (error || !event) {
    return (
      <Alert status="error" borderRadius="12px">
        <AlertIcon />
        {error || 'Event nicht gefunden'}
      </Alert>
    );
  }

  const availableParticipants = allParticipants.filter(
    p => !event.participants?.some(ep => ep.id === p.id)
  );

  const availableTags = allTags.filter(
    t => !event.tags?.some(et => et.id === t.id)
  );

  return (
    <Box animation="fadeIn 0.5s ease">
      {/* Back Button */}
      <Button
        leftIcon={<Icon as={ArrowLeft} boxSize="20px" />}
        onClick={() => navigate('/events')}
        bg="rgba(235, 94, 40, 0.1)"
        color="#EB5E28"
        _hover={{ bg: 'rgba(235, 94, 40, 0.2)' }}
        borderRadius="12px"
        mb="20px"
      >
        Zurück zu Events
      </Button>

      {/* Event Header */}
      <Card
        bg={cardBg}
        border={`1px solid ${cardBorder}`}
        boxShadow={cardShadow}
        backdropFilter="blur(20px)"
        borderRadius="20px"
        padding="0"
        mb="20px"
        overflow="hidden"
      >
        {event.image_url && (
          <Box
            width="100%"
            height={{ base: '200px', sm: '250px', md: '300px' }}
            overflow="hidden"
          >
            <Box
              as="img"
              src={event.image_url}
              alt={event.title}
              width="100%"
              height="100%"
              objectFit="cover"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </Box>
        )}
        <Box padding={{ base: '20px', md: '30px' }}>
          <Flex 
            direction={{ base: 'column', md: 'row' }}
            justifyContent={{ base: 'flex-start', md: 'space-between' }}
            alignItems={{ base: 'stretch', md: 'flex-start' }}
            gap={{ base: '16px', md: '20px' }}
          >
            <VStack align="flex-start" spacing="16px" flex="1" minWidth="0" width="100%">
              <Heading 
                fontSize={{ base: '24px', sm: '28px', md: '32px', lg: '36px' }} 
                fontWeight={800} 
                color={titleColor}
                wordBreak="break-word"
                width="100%"
              >
                {event.title}
              </Heading>
              <VStack align="flex-start" spacing="12px" fontSize={{ base: '13px', sm: '14px', md: '15px' }} color={textColor} width="100%">
                <HStack spacing="8px" flexWrap="wrap">
                  <Icon as={Calendar} boxSize={{ base: '16px', md: '18px' }} color="#EB5E28" />
                  <Text>
                    {new Date(event.date).toLocaleDateString('de-DE', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </HStack>
                <HStack spacing="8px" flexWrap="wrap">
                  <Icon as={Clock} boxSize={{ base: '16px', md: '18px' }} color="#EB5E28" />
                  <Text>
                    {new Date(event.date).toLocaleTimeString('de-DE', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </HStack>
                <HStack spacing="8px" flexWrap="wrap">
                  <Icon as={MapPin} boxSize={{ base: '16px', md: '18px' }} color="#EB5E28" />
                  <Text>{event.location}</Text>
                </HStack>
                <HStack spacing="8px" flexWrap="wrap">
                  <Icon as={Users} boxSize={{ base: '16px', md: '18px' }} color="#EB5E28" />
                  <Text>{event.participants?.length || 0} / {event.max_participants} Teilnehmer</Text>
                </HStack>
              </VStack>
            </VStack>
            <HStack 
              spacing="12px" 
              width={{ base: '100%', md: 'auto' }}
              justifyContent={{ base: 'flex-start', md: 'flex-end' }}
              flexWrap="wrap"
            >
              <Button
                leftIcon={<Icon as={Edit2} boxSize={{ base: '16px', md: '18px' }} />}
                bg="rgba(59, 130, 246, 0.1)"
                color="#3B82F6"
                _hover={{ bg: 'rgba(59, 130, 246, 0.2)' }}
                borderRadius="10px"
                onClick={() => setEditingEvent(event)}
                size={{ base: 'sm', md: 'md' }}
                flex={{ base: '1', sm: '0 1 auto' }}
                minWidth={{ base: '120px', sm: 'auto' }}
              >
                Bearbeiten
              </Button>
              <Button
                leftIcon={<Icon as={Trash2} boxSize={{ base: '16px', md: '18px' }} />}
                bg="rgba(239, 68, 68, 0.1)"
                color="#ef4444"
                _hover={{ bg: 'rgba(239, 68, 68, 0.2)' }}
                borderRadius="10px"
                onClick={handleDeleteEvent}
                size={{ base: 'sm', md: 'md' }}
                flex={{ base: '1', sm: '0 1 auto' }}
                minWidth={{ base: '120px', sm: 'auto' }}
              >
                Löschen
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Card>

      {/* Weather Card */}
      {weather && (
        <Card
          bg={cardBg}
          border={`1px solid ${cardBorder}`}
          boxShadow={cardShadow}
          backdropFilter="blur(20px)"
          borderRadius="20px"
          padding="30px"
          mb="20px"
        >
          <Flex justifyContent="space-between" alignItems="center" mb="20px">
            <Heading fontSize="24px" fontWeight={700} color={titleColor} display="flex" alignItems="center" gap="12px">
              <Icon as={Cloud} boxSize="24px" />
              Wetter
            </Heading>
            <Text fontSize="14px" color={textColor}>
              {weather.location}, {weather.country}
            </Text>
          </Flex>
          <Flex gap="30px" flexWrap="wrap">
            <HStack spacing="16px">
              {weather.icon && (
                <Box
                  as="img"
                  src={weather.icon}
                  alt={weather.description}
                  width="64px"
                  height="64px"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              <VStack align="flex-start" spacing="4px">
                <Text fontSize="32px" fontWeight={800} color={titleColor}>
                  {weather.temperature}°C
                </Text>
                <Text fontSize="14px" color={textColor}>
                  Gefühlt: {weather.feelsLike}°C
                </Text>
                <Text fontSize="14px" color={textColor} textTransform="capitalize">
                  {weather.description}
                </Text>
              </VStack>
            </HStack>
            <VStack align="flex-start" spacing="12px" fontSize="14px" color={textColor}>
              <HStack spacing="8px">
                <Icon as={Droplets} boxSize="18px" color="#3B82F6" />
                <Text>Luftfeuchtigkeit: {weather.humidity}%</Text>
              </HStack>
              <HStack spacing="8px">
                <Icon as={Wind} boxSize="18px" color="#3B82F6" />
                <Text>Wind: {weather.windSpeed} km/h</Text>
              </HStack>
            </VStack>
          </Flex>
        </Card>
      )}

      {weatherLoading && (
        <Card
          bg={cardBg}
          border={`1px solid ${cardBorder}`}
          boxShadow={cardShadow}
          backdropFilter="blur(20px)"
          borderRadius="20px"
          padding="30px"
          mb="20px"
          textAlign="center"
        >
          <Spinner size="md" color="#EB5E28" />
          <Text mt="12px" color={textColor}>Lade Wetterdaten...</Text>
        </Card>
      )}

      {error && error.includes('API key') && (
        <Alert status="warning" borderRadius="12px" mb="20px">
          <AlertIcon />
          <VStack align="flex-start" spacing="4px">
            <Text fontWeight={600}>{error}</Text>
            <Text fontSize="12px">
              Bitte füge deinen OpenWeatherMap API-Schlüssel in backend/.env hinzu
            </Text>
          </VStack>
        </Alert>
      )}

      {/* Event Description */}
      {event.description && (
        <Card
          bg={cardBg}
          border={`1px solid ${cardBorder}`}
          boxShadow={cardShadow}
          backdropFilter="blur(20px)"
          borderRadius="20px"
          padding="30px"
          mb="20px"
        >
          <Heading fontSize="24px" fontWeight={700} color={titleColor} mb="16px">
            Beschreibung
          </Heading>
          <Text fontSize="15px" color={textColor} lineHeight="1.6">
            {event.description}
          </Text>
        </Card>
      )}

      {/* Tags Section */}
      <Card
        bg={cardBg}
        border={`1px solid ${cardBorder}`}
        boxShadow={cardShadow}
        backdropFilter="blur(20px)"
        borderRadius="20px"
        padding="30px"
        mb="20px"
      >
        <Flex justifyContent="space-between" alignItems="center" mb="20px">
          <Heading fontSize="24px" fontWeight={700} color={titleColor}>
            Tags
          </Heading>
          <Button
            leftIcon={<Icon as={showAddTag ? X : Plus} boxSize="18px" />}
            size="sm"
            bg="rgba(235, 94, 40, 0.1)"
            color="#EB5E28"
            _hover={{ bg: 'rgba(235, 94, 40, 0.2)' }}
            borderRadius="10px"
            onClick={() => setShowAddTag(!showAddTag)}
          >
            {showAddTag ? 'Abbrechen' : 'Tag hinzufügen'}
          </Button>
        </Flex>

        {showAddTag && availableTags.length > 0 && (
          <Box mb="20px" padding="16px" bg={isDark ? 'rgba(50, 48, 46, 0.5)' : 'rgba(204, 197, 185, 0.1)'} borderRadius="12px">
            <Flex gap="8px" flexWrap="wrap">
              {availableTags.map(tag => (
                <Button
                  key={tag.id}
                  bg={tag.color}
                  color="white"
                  padding="8px 16px"
                  borderRadius="8px"
                  fontSize="13px"
                  fontWeight={600}
                  _hover={{ opacity: 0.8 }}
                  onClick={() => handleAddTag(tag.id)}
                >
                  {tag.name}
                </Button>
              ))}
            </Flex>
          </Box>
        )}

        {event.tags && event.tags.length > 0 ? (
          <Flex gap="12px" flexWrap="wrap">
            {event.tags.map(tag => (
              <HStack
                key={tag.id}
                spacing="8px"
                bg={isDark ? 'rgba(50, 48, 46, 0.5)' : 'rgba(204, 197, 185, 0.1)'}
                padding="8px 12px"
                borderRadius="10px"
              >
                <Badge
                  bg={tag.color}
                  color="white"
                  padding="6px 12px"
                  borderRadius="8px"
                  fontSize="12px"
                  fontWeight={600}
                >
                  {tag.name}
                </Badge>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => handleRemoveTag(tag.id)}
                  title="Tag entfernen"
                  minWidth="auto"
                  padding="4px"
                >
                  <Icon as={X} boxSize="14px" />
                </Button>
              </HStack>
            ))}
          </Flex>
        ) : (
          <Text color={textColor} opacity={0.6}>Keine Tags zugewiesen</Text>
        )}
      </Card>

      {/* Participants Section */}
      <Card
        bg={cardBg}
        border={`1px solid ${cardBorder}`}
        boxShadow={cardShadow}
        backdropFilter="blur(20px)"
        borderRadius="20px"
        padding="30px"
      >
        <Flex justifyContent="space-between" alignItems="center" mb="20px">
          <Heading fontSize="24px" fontWeight={700} color={titleColor}>
            Teilnehmer ({event.participants?.length || 0})
          </Heading>
          <Button
            leftIcon={<Icon as={showAddParticipant ? X : Plus} boxSize="18px" />}
            size="sm"
            bg="rgba(235, 94, 40, 0.1)"
            color="#EB5E28"
            _hover={{ bg: 'rgba(235, 94, 40, 0.2)' }}
            borderRadius="10px"
            onClick={() => setShowAddParticipant(!showAddParticipant)}
          >
            {showAddParticipant ? 'Abbrechen' : 'Teilnehmer hinzufügen'}
          </Button>
        </Flex>

        {showAddParticipant && availableParticipants.length > 0 && (
          <Box mb="20px" padding="16px" bg={isDark ? 'rgba(50, 48, 46, 0.5)' : 'rgba(204, 197, 185, 0.1)'} borderRadius="12px">
            <VStack align="stretch" spacing="8px">
              {availableParticipants.map(participant => (
                <Button
                  key={participant.id}
                  justifyContent="flex-start"
                  bg={isDark ? 'rgba(50, 48, 46, 0.7)' : 'white'}
                  border={`1px solid ${cardBorder}`}
                  borderRadius="10px"
                  padding="12px"
                  _hover={{ bg: isDark ? 'rgba(50, 48, 46, 0.9)' : 'rgba(204, 197, 185, 0.1)' }}
                  onClick={() => handleAddParticipant(participant.id)}
                >
                  <HStack spacing="12px" width="100%">
                    <Avatar
                      size="sm"
                      name={`${participant.first_name} ${participant.last_name}`}
                      bg="#4F46E5"
                      color="white"
                    />
                    <VStack align="flex-start" spacing="2px" flex="1" minWidth="0">
                      <Text fontSize="14px" fontWeight={600} color={titleColor} noOfLines={1}>
                        {participant.first_name} {participant.last_name}
                      </Text>
                      <Text fontSize="12px" color={textColor} noOfLines={1}>
                        {participant.email}
                      </Text>
                    </VStack>
                  </HStack>
                </Button>
              ))}
            </VStack>
          </Box>
        )}

        {event.participants && event.participants.length > 0 ? (
          <VStack align="stretch" spacing="12px">
            {event.participants.map(participant => (
              <Flex
                key={participant.id}
                alignItems="center"
                gap="16px"
                padding="16px"
                bg={isDark ? 'rgba(50, 48, 46, 0.5)' : 'rgba(204, 197, 185, 0.1)'}
                borderRadius="12px"
              >
                <Avatar
                  size="md"
                  name={`${participant.first_name} ${participant.last_name}`}
                  bg="#4F46E5"
                  color="white"
                />
                <VStack align="flex-start" spacing="4px" flex="1" minWidth="0">
                  <Text fontSize="16px" fontWeight={600} color={titleColor}>
                    {participant.first_name} {participant.last_name}
                  </Text>
                  <Text fontSize="14px" color={textColor}>
                    {participant.email}
                  </Text>
                  {participant.registered_at && (
                    <Text fontSize="12px" color={textColor} opacity={0.7}>
                      Angemeldet: {new Date(participant.registered_at).toLocaleDateString('de-DE')}
                    </Text>
                  )}
                </VStack>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveParticipant(participant.id)}
                  title="Entfernen"
                  color="#ef4444"
                  _hover={{ bg: 'rgba(239, 68, 68, 0.1)' }}
                >
                  <Icon as={X} boxSize="18px" />
                </Button>
              </Flex>
            ))}
          </VStack>
        ) : (
          <Text color={textColor} opacity={0.6}>Noch keine Teilnehmer angemeldet</Text>
        )}
      </Card>

      {/* Edit Event Modal */}
      {editingEvent && (
        <EditEventModal
          isOpen={true}
          onClose={() => setEditingEvent(null)}
          onSuccess={() => {
            loadEventDetails();
            setEditingEvent(null);
          }}
          event={editingEvent}
        />
      )}
    </Box>
  );
};

export default EventDetailPage;

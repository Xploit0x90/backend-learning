import React, { useEffect, useState } from 'react';
import { getAllEvents, deleteEvent, getAllTags } from '../adapter/api/useApiClient';
import { Event, Tag } from '../types';
import { Plus, Eye, Edit2, Trash2, Search, X, Calendar } from 'lucide-react';
import CreateEventModal from '../components/CreateEventModal';
import { useNavigate } from 'react-router-dom';
import EditEventModal from '../components/EditEventModal';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Grid,
  Card,
  VStack,
  HStack,
  Icon,
  Badge,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState<'all' | 'upcoming' | 'past'>('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
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
    loadEvents();
    loadTags();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError('Fehler beim Laden der Events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const data = await getAllTags();
      setTags(data);
    } catch (err) {
      console.error('Fehler beim Laden der Tags:', err);
    }
  };

  const handleDeleteEvent = async (id: number, title: string) => {
    if (window.confirm(`Event "${title}" wirklich löschen?`)) {
      try {
        await deleteEvent(id);
        loadEvents();
        toast({
          title: 'Event gelöscht',
          description: `"${title}" wurde erfolgreich gelöscht`,
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

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());
  
    const eventDate = new Date(event.date);
    const now = new Date();
    const matchesDate = 
      filterDate === 'all' ||
      (filterDate === 'upcoming' && eventDate >= now) ||
      (filterDate === 'past' && eventDate < now);
  
    const matchesLocation = 
      filterLocation === 'all' || 
      event.location === filterLocation;
  
    const matchesTags = 
      selectedTags.length === 0 ||
      event.tags?.some(tag => selectedTags.includes(tag.id));
  
    return matchesSearch && matchesDate && matchesLocation && matchesTags;
  });

  if (loading) {
    return (
      <Box textAlign="center" padding="60px" fontSize="18px" color={textColor}>
        Lade Events...
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="12px" mb="20px">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box
      animation="fadeIn 0.5s ease"
      bg={cardBg}
      backdropFilter="blur(25px)"
      borderRadius="24px"
      padding={{ base: '20px', md: '30px', lg: '40px' }}
      border={`1px solid ${cardBorder}`}
      boxShadow={cardShadow}
    >
      {/* Header */}
      <Card
        bg={cardBg}
        border={`1px solid ${cardBorder}`}
        boxShadow={cardShadow}
        backdropFilter="blur(20px)"
        borderRadius="20px"
        padding={{ base: '20px', md: '30px', lg: '35px' }}
        mb="25px"
      >
        <Flex 
          justifyContent="space-between" 
          alignItems={{ base: 'flex-start', md: 'center' }} 
          gap="20px" 
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <VStack align="flex-start" spacing="8px" flex="1" minWidth="0" width={{ base: '100%', md: 'auto' }}>
            <Heading 
              fontSize={{ base: '24px', md: '28px', lg: '32px' }} 
              fontWeight={800} 
              color={titleColor} 
              display="flex" 
              alignItems="center" 
              gap="12px"
              flexWrap="wrap"
            >
              <Icon as={Calendar} boxSize={{ base: '24px', md: '28px', lg: '32px' }} />
              Events
            </Heading>
            <Text fontSize={{ base: '14px', md: '15px' }} color={textColor}>
              Verwalte alle deine Events
            </Text>
          </VStack>
          <Button
            leftIcon={<Icon as={Plus} boxSize="20px" />}
            bg="#EB5E28"
            color="white"
            _hover={{ bg: '#d94d1a', transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(235, 94, 40, 0.4)' }}
            borderRadius="12px"
            padding="14px 24px"
            fontWeight={600}
            fontSize="15px"
            boxShadow="0 4px 15px rgba(235, 94, 40, 0.3)"
            onClick={() => setIsModalOpen(true)}
            width={{ base: '100%', md: 'auto' }}
          >
            Neues Event
          </Button>
        </Flex>
      </Card>

      {/* Search Bar */}
      <Box mb="25px">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={Search} boxSize="18px" color={isDark ? '#b6b3ae' : '#403D39'} opacity={0.5} />
          </InputLeftElement>
          <Input
            placeholder="Events durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg={isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(204, 197, 185, 0.15)'}
            border={`1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(204, 197, 185, 0.3)'}`}
            borderRadius="14px"
            fontSize="15px"
            color={textColor}
            _focus={{
              bg: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
              borderColor: '#EB5E28',
              boxShadow: '0 0 0 3px rgba(235, 94, 40, 0.1)',
            }}
            _placeholder={{
              color: isDark ? '#b6b3ae' : '#403D39',
              opacity: 0.5,
            }}
          />
        </InputGroup>
      </Box>

      {/* Filter Bar */}
      <Card
        bg={cardBg}
        border={`1px solid ${cardBorder}`}
        boxShadow={cardShadow}
        backdropFilter="blur(20px)"
        borderRadius="16px"
        padding={{ base: '16px', md: '20px' }}
        mb="25px"
        overflow="hidden"
      >
        <Flex 
          gap={{ base: '12px', md: '15px' }} 
          alignItems={{ base: 'stretch', sm: 'center' }} 
          flexWrap="wrap" 
          direction={{ base: 'column', sm: 'row' }}
          width="100%"
        >
          {/* Date Filter */}
          <HStack spacing="8px" width={{ base: '100%', sm: 'auto' }} minWidth="0" flex={{ base: '1 1 100%', sm: '0 1 auto' }}>
            <Text fontSize={{ base: '13px', md: '14px' }} fontWeight={600} color={textColor} whiteSpace="nowrap" flexShrink={0}>
              Zeitraum:
            </Text>
            <Select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value as any)}
              bg={isDark ? 'rgba(255, 255, 255, 0.05)' : 'white'}
              border={`1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(204, 197, 185, 0.3)'}`}
              borderRadius="10px"
              fontSize={{ base: '13px', md: '14px' }}
              color={textColor}
              minWidth="0"
              width={{ base: '100%', sm: '180px' }}
              maxWidth="100%"
              _hover={{ borderColor: '#EB5E28' }}
              _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 3px rgba(235, 94, 40, 0.1)' }}
            >
              <option value="all">Alle Events</option>
              <option value="upcoming">Kommende Events</option>
              <option value="past">Vergangene Events</option>
            </Select>
          </HStack>

          {/* Location Filter */}
          <HStack spacing="8px" width={{ base: '100%', sm: 'auto' }} minWidth="0" flex={{ base: '1 1 100%', sm: '0 1 auto' }}>
            <Text fontSize={{ base: '13px', md: '14px' }} fontWeight={600} color={textColor} whiteSpace="nowrap" flexShrink={0}>
              Ort:
            </Text>
            <Select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              bg={isDark ? 'rgba(255, 255, 255, 0.05)' : 'white'}
              border={`1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(204, 197, 185, 0.3)'}`}
              borderRadius="10px"
              fontSize={{ base: '13px', md: '14px' }}
              color={textColor}
              minWidth="0"
              width={{ base: '100%', sm: '180px' }}
              maxWidth="100%"
              _hover={{ borderColor: '#EB5E28' }}
              _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 3px rgba(235, 94, 40, 0.1)' }}
            >
              <option value="all">Alle Orte</option>
              {Array.from(new Set(events.map(e => e.location))).map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </Select>
          </HStack>

          {/* Tags Filter */}
          <HStack spacing="8px" width={{ base: '100%', sm: 'auto' }} flexWrap="wrap" minWidth="0" flex={{ base: '1 1 100%', sm: '0 1 auto' }}>
            <Text fontSize={{ base: '13px', md: '14px' }} fontWeight={600} color={textColor} whiteSpace="nowrap" flexShrink={0}>
              Tags:
            </Text>
            <HStack spacing="8px" flex="1" minWidth="0" width={{ base: '100%', sm: 'auto' }}>
              <Select
                value=""
                onChange={(e) => {
                  const tagId = Number(e.target.value);
                  if (tagId && !selectedTags.includes(tagId)) {
                    setSelectedTags([...selectedTags, tagId]);
                  }
                  e.currentTarget.value = '';
                }}
                bg={isDark ? 'rgba(255, 255, 255, 0.05)' : 'white'}
                border={`1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(204, 197, 185, 0.3)'}`}
                borderRadius="10px"
                fontSize={{ base: '13px', md: '14px' }}
                color={textColor}
                minWidth="0"
                width={{ base: '100%', sm: '180px' }}
                maxWidth="100%"
                _hover={{ borderColor: '#EB5E28' }}
                _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 3px rgba(235, 94, 40, 0.1)' }}
              >
                <option value="">Tag auswählen...</option>
                {tags && tags.length > 0 && tags
                  .filter(tag => !selectedTags.includes(tag.id))
                  .map(tag => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
              </Select>
              {selectedTags.length > 0 && tags && tags.length > 0 && (
                <HStack spacing="8px" flexWrap="wrap" width={{ base: '100%', sm: 'auto' }} minWidth="0">
                  {selectedTags.map(tagId => {
                    const tag = tags.find(t => t.id === tagId);
                    if (!tag) return null;
                    return (
                      <Badge
                        key={tagId}
                        bg={tag.color}
                        color="white"
                        padding="6px 12px"
                        borderRadius="8px"
                        fontSize="12px"
                        fontWeight={600}
                        cursor="pointer"
                        display="flex"
                        alignItems="center"
                        gap="6px"
                        _hover={{ opacity: 0.8 }}
                        onClick={() => {
                          setSelectedTags(selectedTags.filter(id => id !== tagId));
                        }}
                        whiteSpace="nowrap"
                        maxWidth="100%"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {tag.name}
                        <Icon as={X} boxSize="12px" flexShrink={0} />
                      </Badge>
                    );
                  })}
                </HStack>
              )}
            </HStack>
          </HStack>

          {/* Reset Filter */}
          {(filterDate !== 'all' || filterLocation !== 'all' || searchQuery || selectedTags.length > 0) && (
            <Button
              leftIcon={<Icon as={X} boxSize="16px" />}
              bg="rgba(239, 68, 68, 0.1)"
              border={`1px solid rgba(239, 68, 68, 0.3)`}
              borderRadius="10px"
              color="#ef4444"
              fontWeight={600}
              fontSize={{ base: '13px', md: '14px' }}
              padding="10px 16px"
              _hover={{ bg: '#ef4444', color: 'white' }}
              onClick={() => {
                setFilterDate('all');
                setFilterLocation('all');
                setSearchQuery('');
                setSelectedTags([]);
              }}
              width={{ base: '100%', sm: 'auto' }}
              flexShrink={0}
              whiteSpace="nowrap"
            >
              Filter zurücksetzen
            </Button>
          )}

          {/* Results Count */}
          <Box
            marginLeft={{ base: '0', sm: 'auto' }}
            fontSize={{ base: '13px', md: '14px' }}
            fontWeight={600}
            color="#EB5E28"
            bg="rgba(235, 94, 40, 0.1)"
            padding="10px 16px"
            borderRadius="10px"
            width={{ base: '100%', sm: 'auto' }}
            textAlign={{ base: 'center', sm: 'left' }}
            flexShrink={0}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {filteredEvents.length} von {events.length} Events
          </Box>
        </Flex>
      </Card>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <Card
          bg={cardBg}
          border={`1px solid ${cardBorder}`}
          boxShadow={cardShadow}
          backdropFilter="blur(20px)"
          borderRadius="16px"
          padding="80px 20px"
          textAlign="center"
        >
          <Text fontSize="18px" color={textColor}>
            {searchQuery ? 'Keine Events gefunden.' : 'Keine Events vorhanden.'}
          </Text>
        </Card>
      ) : (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="20px">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              bg={cardBg}
              border={`1px solid ${cardBorder}`}
              boxShadow={cardShadow}
              backdropFilter="blur(20px)"
              borderRadius="16px"
              padding={{ base: '16px', md: '20px', lg: '24px' }}
              cursor="pointer"
              transition="all 0.3s ease"
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                borderColor: '#EB5E28',
              }}
              onClick={() => navigate(`/events/${event.id}`)}
            >
              {event.image_url && (
                <Box
                  width="calc(100% + 48px)"
                  height={{ base: '180px', md: '200px', lg: '220px' }}
                  overflow="hidden"
                  bg="rgba(204, 197, 185, 0.1)"
                  margin="-24px -24px 20px -24px"
                  position="relative"
                  borderTopRadius="16px"
                  sx={{
                    '@media (max-width: 768px)': {
                      margin: '-16px -16px 16px -16px',
                      width: 'calc(100% + 32px)',
                    },
                    '@media (min-width: 768px) and (max-width: 1024px)': {
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
                </Box>
              )}
              <VStack align="stretch" spacing={{ base: '10px', md: '12px' }}>
                <Heading 
                  fontSize={{ base: '18px', md: '20px' }} 
                  fontWeight={700} 
                  color={titleColor} 
                  noOfLines={2}
                  wordBreak="break-word"
                >
                  {event.title}
                </Heading>
                <VStack align="stretch" spacing="6px" fontSize={{ base: '13px', md: '14px' }} color={textColor}>
                  <HStack flexWrap="wrap">
                    <Text as="strong" whiteSpace="nowrap">Ort:</Text>
                    <Text>{event.location}</Text>
                  </HStack>
                  <HStack flexWrap="wrap">
                    <Text as="strong" whiteSpace="nowrap">Datum:</Text>
                    <Text>{new Date(event.date).toLocaleString('de-DE')}</Text>
                  </HStack>
                  <HStack flexWrap="wrap">
                    <Text as="strong" whiteSpace="nowrap">Teilnehmer:</Text>
                    <Text>{event.participant_count || 0} / {event.max_participants}</Text>
                  </HStack>
                  {event.description && (
                    <Text noOfLines={2} fontSize={{ base: '12px', md: '13px' }} opacity={0.8}>
                      {event.description}
                    </Text>
                  )}
                </VStack>
                
                {event.tags && event.tags.length > 0 && (
                  <HStack spacing="8px" flexWrap="wrap">
                    {event.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        bg={tag.color}
                        color="white"
                        padding="4px 10px"
                        borderRadius="6px"
                        fontSize="11px"
                        fontWeight={600}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </HStack>
                )}
                
                {/* Action Buttons */}
                <Flex 
                  gap="8px" 
                  flexWrap="wrap" 
                  onClick={(e) => e.stopPropagation()}
                  direction={{ base: 'column', sm: 'row' }}
                >
                  <Button
                    size="sm"
                    leftIcon={<Icon as={Eye} boxSize="16px" />}
                    bg="rgba(235, 94, 40, 0.1)"
                    color="#EB5E28"
                    _hover={{ bg: 'rgba(235, 94, 40, 0.2)' }}
                    borderRadius="8px"
                    onClick={() => navigate(`/events/${event.id}`)}
                    flex={{ base: '1', sm: '0 1 auto' }}
                    width={{ base: '100%', sm: 'auto' }}
                  >
                    Ansehen
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<Icon as={Edit2} boxSize="16px" />}
                    bg="rgba(59, 130, 246, 0.1)"
                    color="#3B82F6"
                    _hover={{ bg: 'rgba(59, 130, 246, 0.2)' }}
                    borderRadius="8px"
                    onClick={() => setEditingEvent(event)}
                    flex={{ base: '1', sm: '0 1 auto' }}
                    width={{ base: '100%', sm: 'auto' }}
                  >
                    Bearbeiten
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<Icon as={Trash2} boxSize="16px" />}
                    bg="rgba(239, 68, 68, 0.1)"
                    color="#ef4444"
                    _hover={{ bg: 'rgba(239, 68, 68, 0.2)' }}
                    borderRadius="8px"
                    onClick={() => handleDeleteEvent(event.id, event.title)}
                    flex={{ base: '1', sm: '0 1 auto' }}
                    width={{ base: '100%', sm: 'auto' }}
                  >
                    Löschen
                  </Button>
                </Flex>
              </VStack>
            </Card>
          ))}
        </Grid>
      )}

      {/* Modals */}
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadEvents}
      />

      {editingEvent && (
        <EditEventModal
          isOpen={true}
          onClose={() => setEditingEvent(null)}
          onSuccess={() => {
            loadEvents();
            setEditingEvent(null);
          }}
          event={editingEvent}
        />
      )}
    </Box>
  );
};

export default EventsPage;

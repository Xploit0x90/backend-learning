import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllEvents, getAllParticipants, getAllTags } from '../adapter/api/useApiClient';
import { Event } from '../types';
import { CalendarDays, Users, Tag as TagIcon, Plus, ArrowRight, MapPin, Clock } from 'lucide-react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Grid,
  Card,
  VStack,
  HStack,
  Icon,
  Button,
} from '@chakra-ui/react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    totalTags: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Color values based on dark mode
  const cardBg = isDark ? 'rgba(50, 48, 46, 0.7)' : 'rgba(255, 255, 255, 0.7)';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(204, 197, 185, 0.3)';
  const cardShadow = isDark ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.08)';
  const titleColor = isDark ? '#d4d2ce' : '#252422';
  const textColor = isDark ? '#d4d2ce' : '#403D39';
  const subtitleColor = isDark ? '#d4d2ce' : '#403D39';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [events, participants, tags] = await Promise.all([
        getAllEvents(),
        getAllParticipants(),
        getAllTags(),
      ]);

      setStats({
        totalEvents: events.length,
        totalParticipants: participants.length,
        totalTags: tags.length,
      });

      const now = new Date();
      const upcoming = events
        .filter(event => new Date(event.date) > now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);
      
      setUpcomingEvents(upcoming);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 18) return 'Guten Tag';
    return 'Guten Abend';
  };

  if (loading) {
    return (
      <Box textAlign="center" padding="60px" fontSize="18px" color={textColor}>
        Lade Dashboard...
      </Box>
    );
  }

  return (
    <Box animation="fadeIn 0.5s ease">
      {/* Welcome Section */}
      <Card
        mb="30px"
        bg={cardBg}
        border={`1px solid ${cardBorder}`}
        boxShadow={cardShadow}
        backdropFilter="blur(20px)"
        borderRadius="20px"
        padding={{ base: '20px', md: '30px', lg: '40px' }}
      >
        <Flex 
          justifyContent="space-between" 
          alignItems={{ base: 'flex-start', md: 'center' }} 
          flexWrap="wrap" 
          gap="15px"
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <VStack align="flex-start" spacing="8px" flex="1" minWidth="0">
            <Heading
              fontSize={{ base: '28px', md: '32px', lg: '36px' }}
              fontWeight={800}
              color={titleColor}
              mb="8px"
              wordBreak="break-word"
            >
              {getGreeting()}! 👋
            </Heading>
            <Text fontSize={{ base: '14px', md: '15px', lg: '16px' }} color={subtitleColor}>
              Hier ist deine Event-Übersicht für heute
            </Text>
          </VStack>
          <Box
            fontSize={{ base: '12px', md: '13px', lg: '14px' }}
            color="#EB5E28"
            fontWeight={600}
            bg="rgba(235, 94, 40, 0.1)"
            padding={{ base: '10px 16px', md: '12px 20px' }}
            borderRadius="12px"
            whiteSpace="nowrap"
            textAlign={{ base: 'center', md: 'left' }}
            width={{ base: '100%', md: 'auto' }}
          >
            {new Date().toLocaleDateString('de-DE', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Box>
        </Flex>
      </Card>

      {/* Stats Cards */}
      <Grid
        templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
        gap={{ base: '15px', md: '20px' }}
        mb="30px"
      >
        <Card
          bg={cardBg}
          border={`1px solid ${cardBorder}`}
          boxShadow={cardShadow}
          backdropFilter="blur(15px)"
          borderRadius="16px"
          padding={{ base: '16px', md: '20px' }}
          position="relative"
          transition="all 0.3s ease"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '5px',
            height: '100%',
            bg: '#EB5E28',
            transform: 'scaleY(0)',
            transition: 'transform 0.3s ease',
          }}
          _hover={{
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
            _before: {
              transform: 'scaleY(1)',
            },
          }}
        >
          <Flex alignItems="center" gap={{ base: '12px', md: '15px' }} width="100%" minWidth="0">
            <Box
              width={{ base: '50px', md: '60px' }}
              height={{ base: '50px', md: '60px' }}
              borderRadius="16px"
              bg="rgba(235, 94, 40, 0.1)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="#EB5E28"
              flexShrink={0}
            >
              <Icon as={CalendarDays} boxSize={{ base: '24px', md: '32px' }} />
            </Box>
            <VStack align="flex-start" spacing="8px" flex="1" minWidth="0" overflow="hidden">
              <Heading 
                fontSize={{ base: '28px', md: '32px', lg: '36px' }} 
                fontWeight={800} 
                color={titleColor} 
                lineHeight="1"
                wordBreak="break-word"
                overflow="hidden"
              >
                {stats.totalEvents}
              </Heading>
              <Text
                fontSize={{ base: '12px', md: '13px', lg: '14px' }}
                color={textColor}
                fontWeight={600}
                textTransform="uppercase"
                letterSpacing="0.5px"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                width="100%"
              >
                Events
              </Text>
            </VStack>
          </Flex>
        </Card>

        <Card
          bg={cardBg}
          border={`1px solid ${cardBorder}`}
          boxShadow={cardShadow}
          backdropFilter="blur(15px)"
          borderRadius="16px"
          padding={{ base: '16px', md: '20px' }}
          position="relative"
          transition="all 0.3s ease"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '5px',
            height: '100%',
            bg: '#4F46E5',
            transform: 'scaleY(0)',
            transition: 'transform 0.3s ease',
          }}
          _hover={{
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
            _before: {
              transform: 'scaleY(1)',
            },
          }}
        >
          <Flex alignItems="center" gap={{ base: '12px', md: '15px' }} width="100%" minWidth="0">
            <Box
              width={{ base: '50px', md: '60px' }}
              height={{ base: '50px', md: '60px' }}
              borderRadius="16px"
              bg="rgba(79, 70, 229, 0.1)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="#4F46E5"
              flexShrink={0}
            >
              <Icon as={Users} boxSize={{ base: '24px', md: '32px' }} />
            </Box>
            <VStack align="flex-start" spacing="8px" flex="1" minWidth="0" overflow="hidden">
              <Heading 
                fontSize={{ base: '28px', md: '32px', lg: '36px' }} 
                fontWeight={800} 
                color={titleColor} 
                lineHeight="1"
                wordBreak="break-word"
                overflow="hidden"
              >
                {stats.totalParticipants}
              </Heading>
              <Text
                fontSize={{ base: '12px', md: '13px', lg: '14px' }}
                color={textColor}
                fontWeight={600}
                textTransform="uppercase"
                letterSpacing="0.5px"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                width="100%"
              >
                Teilnehmer
              </Text>
            </VStack>
          </Flex>
        </Card>

        <Card
          bg={cardBg}
          border={`1px solid ${cardBorder}`}
          boxShadow={cardShadow}
          backdropFilter="blur(15px)"
          borderRadius="16px"
          padding={{ base: '16px', md: '20px' }}
          position="relative"
          transition="all 0.3s ease"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '5px',
            height: '100%',
            bg: '#10B981',
            transform: 'scaleY(0)',
            transition: 'transform 0.3s ease',
          }}
          _hover={{
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
            _before: {
              transform: 'scaleY(1)',
            },
          }}
        >
          <Flex alignItems="center" gap={{ base: '12px', md: '15px' }} width="100%" minWidth="0">
            <Box
              width={{ base: '50px', md: '60px' }}
              height={{ base: '50px', md: '60px' }}
              borderRadius="16px"
              bg="rgba(16, 185, 129, 0.1)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="#10B981"
              flexShrink={0}
            >
              <Icon as={TagIcon} boxSize={{ base: '24px', md: '32px' }} />
            </Box>
            <VStack align="flex-start" spacing="8px" flex="1" minWidth="0" overflow="hidden">
              <Heading 
                fontSize={{ base: '28px', md: '32px', lg: '36px' }} 
                fontWeight={800} 
                color={titleColor} 
                lineHeight="1"
                wordBreak="break-word"
                overflow="hidden"
              >
                {stats.totalTags}
              </Heading>
              <Text
                fontSize={{ base: '12px', md: '13px', lg: '14px' }}
                color={textColor}
                fontWeight={600}
                textTransform="uppercase"
                letterSpacing="0.5px"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                width="100%"
              >
                Tags
              </Text>
            </VStack>
          </Flex>
        </Card>
      </Grid>

      {/* Quick Actions */}
      <Box mb="30px">
        <Heading fontSize={{ base: '20px', md: '22px', lg: '24px' }} fontWeight={700} color={titleColor} mb="20px">
          Quick Actions
        </Heading>
        <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={{ base: '12px', md: '15px' }}>
          <Card
            as={Link}
            to="/events"
            bg={cardBg}
            border="2px dashed"
            borderColor={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(204, 197, 185, 0.4)'}
            borderRadius="16px"
            padding="30px"
            textDecoration="none"
            transition="all 0.3s ease"
            _hover={{
              bg: isDark ? 'rgba(50, 48, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              borderStyle: 'solid',
              borderColor: '#EB5E28',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            }}
          >
            <VStack spacing="12px">
              <Icon as={Plus} boxSize="24px" color={textColor} />
              <Text fontWeight={600} fontSize="15px" color={textColor}>
                Neues Event erstellen
              </Text>
            </VStack>
          </Card>

          <Card
            as={Link}
            to="/participants"
            bg={cardBg}
            border="2px dashed"
            borderColor={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(204, 197, 185, 0.4)'}
            borderRadius="16px"
            padding="30px"
            textDecoration="none"
            transition="all 0.3s ease"
            _hover={{
              bg: isDark ? 'rgba(50, 48, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              borderStyle: 'solid',
              borderColor: '#4F46E5',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            }}
          >
            <VStack spacing="12px">
              <Icon as={Plus} boxSize="24px" color={textColor} />
              <Text fontWeight={600} fontSize="15px" color={textColor}>
                Teilnehmer hinzufügen
              </Text>
            </VStack>
          </Card>

          <Card
            as={Link}
            to="/tags"
            bg={cardBg}
            border="2px dashed"
            borderColor={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(204, 197, 185, 0.4)'}
            borderRadius="16px"
            padding="30px"
            textDecoration="none"
            transition="all 0.3s ease"
            _hover={{
              bg: isDark ? 'rgba(50, 48, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              borderStyle: 'solid',
              borderColor: '#10B981',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            }}
          >
            <VStack spacing="12px">
              <Icon as={Plus} boxSize="24px" color={textColor} />
              <Text fontWeight={600} fontSize="15px" color={textColor}>
                Neuer Tag erstellen
              </Text>
            </VStack>
          </Card>
        </Grid>
      </Box>

      {/* Upcoming Events */}
      <Box mb="30px">
        <Flex justifyContent="space-between" alignItems={{ base: 'flex-start', md: 'center' }} mb="20px" flexDirection={{ base: 'column', md: 'row' }} gap="10px">
          <Heading fontSize={{ base: '20px', md: '22px', lg: '24px' }} fontWeight={700} color={titleColor}>
            Kommende Events
          </Heading>
          <Box
            as={Link}
            to="/events"
            display="flex"
            alignItems="center"
            gap="6px"
            color="#EB5E28"
            textDecoration="none"
            fontWeight={600}
            fontSize="14px"
            transition="all 0.3s ease"
            _hover={{ gap: '10px' }}
          >
            Alle anzeigen <Icon as={ArrowRight} boxSize="16px" />
          </Box>
        </Flex>

        {upcomingEvents.length === 0 ? (
          <Card
            bg={cardBg}
            border="2px dashed"
            borderColor={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(204, 197, 185, 0.4)'}
            borderRadius="16px"
            padding="60px"
            textAlign="center"
            color={textColor}
          >
            <VStack spacing="15px">
              <Icon as={CalendarDays} boxSize="48px" opacity={0.3} />
              <Text fontSize="16px" mb="20px">
                Keine kommenden Events geplant
              </Text>
              <Button
                as={Link}
                to="/events"
                bg="#EB5E28"
                color="white"
                _hover={{ bg: '#d94d1a', transform: 'translateY(-2px)' }}
                borderRadius="12px"
                padding="12px 24px"
                fontWeight={600}
              >
                Erstes Event erstellen
              </Button>
            </VStack>
          </Card>
        ) : (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(auto-fit, minmax(320px, 1fr))' }} gap="20px">
            {upcomingEvents.map((event) => (
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
                <Flex gap={{ base: '12px', md: '16px', lg: '20px' }} alignItems="flex-start" flexWrap="wrap">
                  <Box
                    minWidth={{ base: '50px', md: '60px' }}
                    height={{ base: '60px', md: '70px' }}
                    bg="linear-gradient(135deg, #EB5E28 0%, #d94d1a 100%)"
                    borderRadius="12px"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                    boxShadow="0 4px 15px rgba(235, 94, 40, 0.3)"
                    flexShrink={0}
                  >
                    <Text fontSize={{ base: '11px', md: '12px' }} fontWeight={600} textTransform="uppercase" opacity={0.9}>
                      {new Date(event.date).toLocaleDateString('de-DE', { month: 'short' })}
                    </Text>
                    <Text fontSize={{ base: '24px', md: '28px' }} fontWeight={800} lineHeight="1">
                      {new Date(event.date).getDate()}
                    </Text>
                  </Box>
                  <VStack align="flex-start" flex="1" spacing={{ base: '6px', md: '8px' }} minWidth="0">
                    <Heading fontSize={{ base: '16px', md: '18px' }} fontWeight={700} color={titleColor} noOfLines={2} wordBreak="break-word">
                      {event.title}
                    </Heading>
                    <HStack spacing="6px" color={textColor} fontSize={{ base: '13px', md: '14px' }} flexWrap="wrap">
                      <Icon as={MapPin} boxSize="16px" flexShrink={0} />
                      <Text>{event.location}</Text>
                    </HStack>
                    <HStack spacing="6px" color={textColor} fontSize={{ base: '13px', md: '14px' }} flexWrap="wrap">
                      <Icon as={Clock} boxSize="16px" flexShrink={0} />
                      <Text>
                        {new Date(event.date).toLocaleTimeString('de-DE', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </HStack>
                    <HStack spacing="6px" fontSize={{ base: '12px', md: '13px' }} color="#EB5E28" fontWeight={600} mt="8px" flexWrap="wrap">
                      <Icon as={Users} boxSize="14px" flexShrink={0} />
                      <Text>
                        {event.participant_count || 0} / {event.max_participants}
                      </Text>
                    </HStack>
                  </VStack>
                  <Button
                    as={Link}
                    to={`/events/${event.id}`}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    size="sm"
                    bg="rgba(235, 94, 40, 0.1)"
                    color="#EB5E28"
                    borderRadius="10px"
                    padding={{ base: '8px 14px', md: '10px 18px' }}
                    fontWeight={600}
                    fontSize={{ base: '12px', md: '13px' }}
                    whiteSpace="nowrap"
                    width={{ base: '100%', md: 'auto' }}
                    _hover={{
                      bg: '#EB5E28',
                      color: 'white',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(235, 94, 40, 0.3)',
                    }}
                  >
                    Details <Icon as={ArrowRight} boxSize="16px" ml="8px" />
                  </Button>
                </Flex>
              </Card>
            ))}
          </Grid>
        )}
      </Box>

      {/* Activity Feed */}
      <Card
        bg={cardBg}
        border={`1px solid ${cardBorder}`}
        boxShadow={cardShadow}
        backdropFilter="blur(20px)"
        borderRadius="20px"
        padding="30px"
      >
        <Heading fontSize="24px" fontWeight={700} color={titleColor} mb="20px">
          Letzte Aktivitäten
        </Heading>
        <VStack spacing="15px" align="stretch">
          <Flex gap="15px" alignItems="flex-start" padding="15px" bg={isDark ? 'rgba(50, 48, 46, 0.5)' : 'rgba(255, 255, 255, 0.5)'} borderRadius="12px" transition="all 0.3s ease" _hover={{ bg: isDark ? 'rgba(50, 48, 46, 0.8)' : 'rgba(255, 255, 255, 0.8)', transform: 'translateX(5px)' }}>
            <Box
              width="40px"
              height="40px"
              borderRadius="10px"
              bg="rgba(235, 94, 40, 0.1)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="#EB5E28"
              flexShrink={0}
            >
              <Icon as={CalendarDays} boxSize="18px" />
            </Box>
            <VStack align="flex-start" spacing="4px" flex="1">
              <Text fontSize="15px" color={titleColor}>
                <Text as="strong">Neues Event</Text> wurde erstellt
              </Text>
              <Text fontSize="13px" color={textColor} opacity={0.7}>
                Vor 2 Stunden
              </Text>
            </VStack>
          </Flex>

          <Flex gap="15px" alignItems="flex-start" padding="15px" bg={isDark ? 'rgba(50, 48, 46, 0.5)' : 'rgba(255, 255, 255, 0.5)'} borderRadius="12px" transition="all 0.3s ease" _hover={{ bg: isDark ? 'rgba(50, 48, 46, 0.8)' : 'rgba(255, 255, 255, 0.8)', transform: 'translateX(5px)' }}>
            <Box
              width="40px"
              height="40px"
              borderRadius="10px"
              bg="rgba(79, 70, 229, 0.1)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="#4F46E5"
              flexShrink={0}
            >
              <Icon as={Users} boxSize="18px" />
            </Box>
            <VStack align="flex-start" spacing="4px" flex="1">
              <Text fontSize="15px" color={titleColor}>
                <Text as="strong">3 neue Teilnehmer</Text> haben sich registriert
              </Text>
              <Text fontSize="13px" color={textColor} opacity={0.7}>
                Vor 5 Stunden
              </Text>
            </VStack>
          </Flex>

          <Flex gap="15px" alignItems="flex-start" padding="15px" bg={isDark ? 'rgba(50, 48, 46, 0.5)' : 'rgba(255, 255, 255, 0.5)'} borderRadius="12px" transition="all 0.3s ease" _hover={{ bg: isDark ? 'rgba(50, 48, 46, 0.8)' : 'rgba(255, 255, 255, 0.8)', transform: 'translateX(5px)' }}>
            <Box
              width="40px"
              height="40px"
              borderRadius="10px"
              bg="rgba(16, 185, 129, 0.1)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="#10B981"
              flexShrink={0}
            >
              <Icon as={TagIcon} boxSize="18px" />
            </Box>
            <VStack align="flex-start" spacing="4px" flex="1">
              <Text fontSize="15px" color={titleColor}>
                <Text as="strong">Tag "Sport"</Text> wurde hinzugefügt
              </Text>
              <Text fontSize="13px" color={textColor} opacity={0.7}>
                Gestern
              </Text>
            </VStack>
          </Flex>
        </VStack>
      </Card>
    </Box>
  );
};

export default HomePage;

import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Participant } from '../types';
import { Users, Mail, Phone, GraduationCap, Calendar, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import CreateParticipantModal from '../components/CreateParticipantModal';
import { getAllParticipants, deleteParticipant } from '../adapter/api/useApiClient';
import EditParticipantModal from '../components/EditParticipantModal';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Grid,
  Card,
  VStack,
  HStack,
  Icon,
  Avatar,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';

const ParticipantsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredParticipants = participants.filter(p =>
    p.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.study_program?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadParticipants = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllParticipants();
      setParticipants(data);
      setError(null);
    } catch (err: unknown) {
      const hasResponse = err && typeof err === 'object' && 'response' in err;
      const code = err && typeof err === 'object' && 'code' in err && (err as { code?: string }).code;
      const message = err && typeof err === 'object' && 'message' in err && typeof (err as { message?: unknown }).message === 'string' && (err as { message: string }).message;
      const resData = hasResponse && (err as { response?: { data?: { message?: string; error?: string } } }).response?.data;
      const isNetworkError = !hasResponse && (code === 'ERR_NETWORK' || message?.includes('Network Error'));
      const errorMessage = isNetworkError
        ? t('participants.backendUnavailable')
        : (resData?.message || resData?.error || t('participants.loadError'));
      setError(errorMessage);
      console.error('Error loading participants:', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadParticipants();
  }, [loadParticipants]);

  const handleDeleteParticipant = async (id: number, name: string) => {
    if (window.confirm(t('participants.deleteConfirm', { name }))) {
      try {
        await deleteParticipant(id);
        loadParticipants();
        toast({
          title: t('participants.deleted'),
          description: t('participants.deletedDescription', { name }),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: t('common.error'),
          description: t('participants.deleteError'),
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
      <Box textAlign="center" padding="60px" fontSize="18px" color={textColor}>
        {t('participants.loading')}
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
              <Icon as={Users} boxSize={{ base: '24px', md: '28px', lg: '32px' }} />
              {t('participants.title')}
            </Heading>
            <Text fontSize={{ base: '14px', md: '15px' }} color={textColor}>
              {t('participants.manageAll')}
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
            {t('participants.newParticipant')}
          </Button>
        </Flex>
      </Card>

      {/* Stats Bar */}
      <Card
        bg={cardBg}
        border={`1px solid ${cardBorder}`}
        boxShadow={cardShadow}
        backdropFilter="blur(20px)"
        borderRadius="16px"
        padding={{ base: '16px', md: '20px' }}
        mb="25px"
      >
        <Grid templateColumns={{ base: '1fr', sm: 'repeat(3, 1fr)' }} gap={{ base: '16px', md: '20px' }}>
          <VStack spacing="8px">
            <Heading fontSize="32px" fontWeight={800} color="#4F46E5">
              {participants.length}
            </Heading>
            <Text fontSize="14px" color={textColor} fontWeight={600}>
              {t('participants.total')}
            </Text>
          </VStack>
          <VStack spacing="8px">
            <Heading fontSize="32px" fontWeight={800} color="#10B981">
              {participants.filter(p => (p.event_count || 0) > 0).length}
            </Heading>
            <Text fontSize="14px" color={textColor} fontWeight={600}>
              {t('participants.active')}
            </Text>
          </VStack>
          <VStack spacing="8px">
            <Heading fontSize="32px" fontWeight={800} color="#EB5E28">
              {participants.filter(p => (p.event_count || 0) === 0).length}
            </Heading>
            <Text fontSize="14px" color={textColor} fontWeight={600}>
              {t('participants.new')}
            </Text>
          </VStack>
        </Grid>
      </Card>

      {/* Search Bar */}
      <Box mb="25px">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={Search} boxSize="18px" color={isDark ? '#b6b3ae' : '#403D39'} opacity={0.5} />
          </InputLeftElement>
          <Input
            placeholder={t('participants.searchPlaceholder')}
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

      {/* Participants List */}
      {filteredParticipants.length === 0 ? (
        <Card
          bg={cardBg}
          border={`1px solid ${cardBorder}`}
          boxShadow={cardShadow}
          backdropFilter="blur(20px)"
          borderRadius="16px"
          padding="80px 20px"
          textAlign="center"
        >
          <VStack spacing="20px">
            <Icon as={Users} boxSize="64px" opacity={0.3} />
            <VStack spacing="8px">
              <Heading fontSize="24px" color={titleColor}>
                {t('participants.noParticipants')}
              </Heading>
              <Text fontSize="16px" color={textColor}>
                {searchQuery
                  ? t('common.tryDifferentSearch')
                  : t('participants.addFirst')}
              </Text>
            </VStack>
            <Button
              leftIcon={<Icon as={Plus} boxSize="20px" />}
              bg="#EB5E28"
              color="white"
              _hover={{ bg: '#d94d1a', transform: 'translateY(-2px)' }}
              borderRadius="12px"
              padding="14px 24px"
              fontWeight={600}
              fontSize="15px"
              onClick={() => setIsModalOpen(true)}
            >
              {t('participants.addFirstButton')}
            </Button>
          </VStack>
        </Card>
      ) : (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="20px">
          {filteredParticipants.map((participant) => (
            <Card
              key={participant.id}
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
                borderColor: '#4F46E5',
              }}
              onClick={() => navigate(`/participants/${participant.id}`)}
            >
              <VStack align="stretch" spacing={{ base: '12px', md: '16px' }}>
                <Flex alignItems="center" gap={{ base: '12px', md: '16px' }} flexWrap="wrap">
                  <Avatar
                    size={{ base: 'md', md: 'lg' }}
                    name={`${participant.first_name} ${participant.last_name}`}
                    bg="#4F46E5"
                    color="white"
                    fontWeight={700}
                    flexShrink={0}
                  />
                  <VStack align="flex-start" spacing="4px" flex="1" minWidth="0">
                    <Heading 
                      fontSize={{ base: '18px', md: '20px' }} 
                      fontWeight={700} 
                      color={titleColor} 
                      noOfLines={1}
                      wordBreak="break-word"
                    >
                      {participant.first_name} {participant.last_name}
                    </Heading>
                  </VStack>
                </Flex>

                <VStack align="stretch" spacing="8px" fontSize={{ base: '13px', md: '14px' }} color={textColor}>
                  <HStack spacing="8px" flexWrap="wrap">
                    <Icon as={Mail} boxSize="16px" color="#EB5E28" flexShrink={0} />
                    <Text noOfLines={1} minWidth="0" flex="1">{participant.email}</Text>
                  </HStack>

                  {participant.phone && (
                    <HStack spacing="8px" flexWrap="wrap">
                      <Icon as={Phone} boxSize="16px" color="#EB5E28" flexShrink={0} />
                      <Text>{participant.phone}</Text>
                    </HStack>
                  )}

                  {participant.study_program && (
                    <HStack spacing="8px" flexWrap="wrap">
                      <Icon as={GraduationCap} boxSize="16px" color="#EB5E28" flexShrink={0} />
                      <Text>{participant.study_program}</Text>
                    </HStack>
                  )}

                  <HStack spacing="8px" flexWrap="wrap">
                    <Icon as={Calendar} boxSize="16px" color="#EB5E28" flexShrink={0} />
                    <Text>
                      {t('participants.eventCount', { count: participant.event_count || 0 })}
                    </Text>
                  </HStack>
                </VStack>

                {participant.notes && (
                  <Box
                    padding={{ base: '10px', md: '12px' }}
                    bg={isDark ? 'rgba(50, 48, 46, 0.5)' : 'rgba(204, 197, 185, 0.1)'}
                    borderRadius="8px"
                    fontSize={{ base: '12px', md: '13px' }}
                    color={textColor}
                    opacity={0.8}
                  >
                    <Text noOfLines={2}>{participant.notes}</Text>
                  </Box>
                )}

                <Flex 
                  gap="8px" 
                  flexWrap="wrap" 
                  onClick={(e) => e.stopPropagation()}
                  direction={{ base: 'column', sm: 'row' }}
                >
                  <Button
                    size="sm"
                    leftIcon={<Icon as={Edit2} boxSize="18px" />}
                    bg="rgba(59, 130, 246, 0.2)"
                    color="#3B82F6"
                    _hover={{ bg: 'rgba(59, 130, 246, 0.3)' }}
                    borderRadius="8px"
                    flex={{ base: '1', sm: '0 1 auto' }}
                    padding="12px 24px"
                    minHeight="40px"
                    fontWeight={600}
                    whiteSpace="nowrap"
                    width={{ base: '100%', sm: 'auto' }}
                    onClick={() => setEditingParticipant(participant)}
                  >
                    {t('common.edit')}
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<Icon as={Trash2} boxSize="18px" />}
                    bg="rgba(239, 68, 68, 0.2)"
                    color="#ef4444"
                    _hover={{ bg: 'rgba(239, 68, 68, 0.3)' }}
                    borderRadius="8px"
                    flex={{ base: '1', sm: '0 1 auto' }}
                    padding="12px 20px"
                    minHeight="40px"
                    fontWeight={600}
                    whiteSpace="nowrap"
                    width={{ base: '100%', sm: 'auto' }}
                    onClick={() => handleDeleteParticipant(
                      participant.id,
                      `${participant.first_name} ${participant.last_name}`
                    )}
                  >
                    {t('common.delete')}
                  </Button>
                </Flex>
              </VStack>
            </Card>
          ))}
        </Grid>
      )}

      {/* Modals */}
      <CreateParticipantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadParticipants}
      />

      {editingParticipant && (
        <EditParticipantModal
          isOpen={true}
          onClose={() => setEditingParticipant(null)}
          onSuccess={() => {
            loadParticipants();
            setEditingParticipant(null);
          }}
          participant={editingParticipant}
        />
      )}
    </Box>
  );
};

export default ParticipantsPage;

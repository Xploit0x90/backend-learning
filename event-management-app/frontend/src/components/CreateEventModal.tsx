import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Users, Image, FileText } from 'lucide-react';
import { createEvent } from '../adapter/api/useApiClient';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  HStack,
  VStack,
  Alert,
  AlertIcon,
  useColorModeValue,
  Grid,
} from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    max_participants: 50,
    image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(40, 38, 36, 0.85)');
  const cardBorder = useColorModeValue('rgba(204, 197, 185, 0.3)', 'rgba(255, 255, 255, 0.08)');
  const inputBg = useColorModeValue('white', 'rgba(40, 38, 36, 0.9)');
  const inputColor = useColorModeValue('#252422', '#d4d2ce');
  const inputBorder = useColorModeValue('rgba(204, 197, 185, 0.3)', 'rgba(255, 255, 255, 0.1)');
  const inputHoverBorder = useColorModeValue('#EB5E28', 'rgba(235, 94, 40, 0.5)');
  const inputPlaceholderColor = useColorModeValue('gray.400', 'gray.500');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = t('createEvent.eventTitleRequired');
    }
    if (!formData.location.trim()) {
      errors.location = t('createEvent.locationRequired');
    }
    if (!formData.date) {
      errors.date = t('createEvent.dateRequired');
    }
    if (!formData.time) {
      errors.time = t('createEvent.timeRequired');
    }
    const maxParticipants = Number(formData.max_participants);
    if (isNaN(maxParticipants) || maxParticipants < 1) {
      errors.max_participants = t('createEvent.maxParticipantsError');
    }
    if (formData.image_url && formData.image_url.trim()) {
      try {
        new URL(formData.image_url);
      } catch {
        errors.image_url = t('createEvent.imageUrlError');
      }
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const dateTime = `${formData.date}T${formData.time}:00`;
      
      await createEvent({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        location: formData.location.trim(),
        date: dateTime,
        max_participants: Number(formData.max_participants),
        image_url: formData.image_url.trim() || undefined,
      });

      setFormData({
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        max_participants: 50,
        image_url: '',
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      if (err?.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const backendErrors: Record<string, string> = {};
        err.response.data.errors.forEach((error: any) => {
          const fieldMap: Record<string, string> = {
            'title': 'title',
            'location': 'location',
            'date': 'date',
            'max_participants': 'max_participants',
            'image_url': 'image_url',
          };
          const frontendField = fieldMap[error.field] || error.field;
          backendErrors[frontendField] = error.message;
        });
        setFieldErrors(backendErrors);
        setError(t('createEvent.fixFields'));
      } else {
        const errorMessage = err?.response?.data?.message || 
                            err?.response?.data?.error || 
                            t('createEvent.createError');
        setError(errorMessage);
      }
      console.error('Create event error:', err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent
        bg={cardBg}
        border={`1px solid ${cardBorder}`}
        backdropFilter="blur(20px)"
        borderRadius="20px"
        maxH="90vh"
      >
        <ModalHeader fontSize="24px" fontWeight={700}>
          {t('createEvent.title')}
        </ModalHeader>
        <ModalCloseButton />

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing="20px">
              {error && (
                <Alert status="error" borderRadius="12px" width="100%">
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              <FormControl isRequired isInvalid={!!fieldErrors.title}>
                <FormLabel display="flex" alignItems="center" gap="8px">
                  <Icon as={FileText} boxSize="18px" />
                  {t('createEvent.eventTitle')}
                </FormLabel>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={t('createEvent.eventTitlePlaceholder')}
                  borderRadius="12px"
                  bg={inputBg}
                  color={inputColor}
                  borderColor={inputBorder}
                    _hover={{ borderColor: inputHoverBorder }}
                    _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 1px #EB5E28' }}
                    _placeholder={{ color: inputPlaceholderColor }}
                />
                <FormErrorMessage>{fieldErrors.title}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel display="flex" alignItems="center" gap="8px">
                  <Icon as={FileText} boxSize="18px" />
                  {t('createEvent.description')}
                </FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={t('createEvent.descriptionPlaceholder')}
                  rows={4}
                  borderRadius="12px"
                  bg={inputBg}
                  color={inputColor}
                  borderColor={inputBorder}
                    _hover={{ borderColor: inputHoverBorder }}
                    _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 1px #EB5E28' }}
                    _placeholder={{ color: inputPlaceholderColor }}
                />
              </FormControl>

              <FormControl isRequired isInvalid={!!fieldErrors.location}>
                <FormLabel display="flex" alignItems="center" gap="8px">
                  <Icon as={MapPin} boxSize="18px" />
                  {t('common.location')}
                </FormLabel>
                <Input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder={t('createEvent.locationPlaceholder')}
                  borderRadius="12px"
                  bg={inputBg}
                  color={inputColor}
                  borderColor={inputBorder}
                    _hover={{ borderColor: inputHoverBorder }}
                    _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 1px #EB5E28' }}
                    _placeholder={{ color: inputPlaceholderColor }}
                />
                <FormErrorMessage>{fieldErrors.location}</FormErrorMessage>
              </FormControl>

              <Grid templateColumns="repeat(2, 1fr)" gap="16px" width="100%">
                <FormControl isRequired isInvalid={!!fieldErrors.date}>
                  <FormLabel display="flex" alignItems="center" gap="8px">
                    <Icon as={Calendar} boxSize="18px" />
                    {t('common.date')}
                  </FormLabel>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    borderRadius="12px"
                    bg={inputBg}
                    color={inputColor}
                    borderColor={inputBorder}
                    _hover={{ borderColor: useColorModeValue('#EB5E28', 'rgba(235, 94, 40, 0.5)') }}
                    _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 1px #EB5E28' }}
                  />
                  <FormErrorMessage>{fieldErrors.date}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!fieldErrors.time}>
                  <FormLabel display="flex" alignItems="center" gap="8px">
                    <Icon as={Calendar} boxSize="18px" />
                    {t('createEvent.timeLabel')}
                  </FormLabel>
                  <Input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    borderRadius="12px"
                    bg={inputBg}
                    color={inputColor}
                    borderColor={inputBorder}
                    _hover={{ borderColor: useColorModeValue('#EB5E28', 'rgba(235, 94, 40, 0.5)') }}
                    _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 1px #EB5E28' }}
                  />
                  <FormErrorMessage>{fieldErrors.time}</FormErrorMessage>
                </FormControl>
              </Grid>

              <FormControl isInvalid={!!fieldErrors.max_participants}>
                <FormLabel display="flex" alignItems="center" gap="8px">
                  <Icon as={Users} boxSize="18px" />
                  {t('createEvent.maxParticipants')}
                </FormLabel>
                <Input
                  type="number"
                  name="max_participants"
                  value={formData.max_participants}
                  onChange={handleChange}
                  min="1"
                  max="1000"
                  borderRadius="12px"
                  bg={inputBg}
                  color={inputColor}
                  borderColor={inputBorder}
                    _hover={{ borderColor: inputHoverBorder }}
                    _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 1px #EB5E28' }}
                    _placeholder={{ color: inputPlaceholderColor }}
                />
                <FormErrorMessage>{fieldErrors.max_participants}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!fieldErrors.image_url}>
                <FormLabel display="flex" alignItems="center" gap="8px">
                  <Icon as={Image} boxSize="18px" />
                  {t('createEvent.imageUrl')}
                </FormLabel>
                <Input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  borderRadius="12px"
                  bg={inputBg}
                  color={inputColor}
                  borderColor={inputBorder}
                    _hover={{ borderColor: inputHoverBorder }}
                    _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 1px #EB5E28' }}
                    _placeholder={{ color: inputPlaceholderColor }}
                />
                <FormErrorMessage>{fieldErrors.image_url}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <HStack spacing="12px">
              <Button
                type="button"
                onClick={onClose}
                bg="rgba(107, 114, 128, 0.1)"
                color="#6B7280"
                _hover={{ bg: 'rgba(107, 114, 128, 0.2)' }}
                borderRadius="12px"
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                bg="#EB5E28"
                color="white"
                _hover={{ bg: '#d94d1a' }}
                borderRadius="12px"
                isLoading={loading}
                loadingText={t('common.creating')}
              >
                {t('createEvent.createButton')}
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateEventModal;

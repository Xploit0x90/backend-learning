import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Image, FileText } from 'lucide-react';
import { updateEvent } from '../adapter/api/useApiClient';
import { Event } from '../types';
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
  HStack,
  VStack,
  Alert,
  AlertIcon,
  useColorModeValue,
  Grid,
} from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  event: Event;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ isOpen, onClose, onSuccess, event }) => {
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

  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(40, 38, 36, 0.85)');
  const cardBorder = useColorModeValue('rgba(204, 197, 185, 0.3)', 'rgba(255, 255, 255, 0.08)');
  const inputBg = useColorModeValue('white', 'rgba(40, 38, 36, 0.9)');
  const inputColor = useColorModeValue('#252422', '#d4d2ce');
  const inputBorder = useColorModeValue('rgba(204, 197, 185, 0.3)', 'rgba(255, 255, 255, 0.1)');
  const inputHoverBorder = useColorModeValue('#EB5E28', 'rgba(235, 94, 40, 0.5)');
  const inputPlaceholderColor = useColorModeValue('gray.400', 'gray.500');

  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.date);
      setFormData({
        title: event.title,
        description: event.description || '',
        location: event.location,
        date: eventDate.toISOString().split('T')[0],
        time: eventDate.toTimeString().slice(0, 5),
        max_participants: event.max_participants,
        image_url: event.image_url || '',
      });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dateTime = `${formData.date}T${formData.time}:00`;
      
      await updateEvent(event.id, {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: dateTime,
        max_participants: Number(formData.max_participants),
        image_url: formData.image_url || undefined,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.response?.data?.error || 
                          err?.response?.data?.errors?.[0]?.message ||
                          'Fehler beim Aktualisieren des Events';
      
      if (err?.response?.data?.errors) {
        const validationErrors = err.response.data.errors
          .map((e: any) => `${e.field}: ${e.message}`)
          .join(', ');
        setError(`Validierungsfehler: ${validationErrors}`);
      } else {
        setError(errorMessage);
      }
      console.error('Update event error:', err?.response?.data || err);
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
          Event bearbeiten
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

              <FormControl isRequired>
                <FormLabel display="flex" alignItems="center" gap="8px">
                  <Icon as={FileText} boxSize="18px" />
                  Event-Titel
                </FormLabel>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  borderRadius="12px"
                  bg={inputBg}
                  color={inputColor}
                  borderColor={inputBorder}
                    _hover={{ borderColor: inputHoverBorder }}
                    _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 1px #EB5E28' }}
                    _placeholder={{ color: inputPlaceholderColor }}
                />
              </FormControl>

              <FormControl>
                <FormLabel display="flex" alignItems="center" gap="8px">
                  <Icon as={FileText} boxSize="18px" />
                  Beschreibung
                </FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
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

              <FormControl isRequired>
                <FormLabel display="flex" alignItems="center" gap="8px">
                  <Icon as={MapPin} boxSize="18px" />
                  Ort
                </FormLabel>
                <Input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  borderRadius="12px"
                  bg={inputBg}
                  color={inputColor}
                  borderColor={inputBorder}
                    _hover={{ borderColor: inputHoverBorder }}
                    _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 1px #EB5E28' }}
                    _placeholder={{ color: inputPlaceholderColor }}
                />
              </FormControl>

              <Grid templateColumns="repeat(2, 1fr)" gap="16px" width="100%">
                <FormControl isRequired>
                  <FormLabel display="flex" alignItems="center" gap="8px">
                    <Icon as={Calendar} boxSize="18px" />
                    Datum
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
                </FormControl>

                <FormControl isRequired>
                  <FormLabel display="flex" alignItems="center" gap="8px">
                    <Icon as={Calendar} boxSize="18px" />
                    Uhrzeit
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
                </FormControl>
              </Grid>

              <FormControl>
                <FormLabel display="flex" alignItems="center" gap="8px">
                  <Icon as={Users} boxSize="18px" />
                  Max. Teilnehmer
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
              </FormControl>

              <FormControl>
                <FormLabel display="flex" alignItems="center" gap="8px">
                  <Icon as={Image} boxSize="18px" />
                  Bild-URL (optional)
                </FormLabel>
                <Input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  borderRadius="12px"
                  bg={inputBg}
                  color={inputColor}
                  borderColor={inputBorder}
                    _hover={{ borderColor: inputHoverBorder }}
                    _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 1px #EB5E28' }}
                    _placeholder={{ color: inputPlaceholderColor }}
                />
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
                Abbrechen
              </Button>
              <Button
                type="submit"
                bg="#EB5E28"
                color="white"
                _hover={{ bg: '#d94d1a' }}
                borderRadius="12px"
                isLoading={loading}
                loadingText="Speichere..."
              >
                Änderungen speichern
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EditEventModal;

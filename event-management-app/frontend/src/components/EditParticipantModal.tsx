import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, GraduationCap, FileText } from 'lucide-react';
import { updateParticipant } from '../adapter/api/useApiClient';
import { Participant } from '../types';
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

interface EditParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  participant: Participant;
}

const EditParticipantModal: React.FC<EditParticipantModalProps> = ({ isOpen, onClose, onSuccess, participant }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    study_program: '',
    notes: '',
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
    if (participant) {
      setFormData({
        first_name: participant.first_name,
        last_name: participant.last_name,
        email: participant.email,
        phone: participant.phone || '',
        study_program: participant.study_program || '',
        notes: participant.notes || '',
      });
    }
  }, [participant]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateParticipant(participant.id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || undefined,
        study_program: formData.study_program || undefined,
        notes: formData.notes || undefined,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Ein Teilnehmer mit dieser E-Mail existiert bereits');
      } else {
        setError('Fehler beim Aktualisieren des Teilnehmers');
      }
      console.error(err);
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
          Teilnehmer bearbeiten
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

              <Grid templateColumns="repeat(2, 1fr)" gap="16px" width="100%">
                <FormControl isRequired>
                  <FormLabel display="flex" alignItems="center" gap="8px">
                    <Icon as={User} boxSize="18px" />
                    Vorname
                  </FormLabel>
                  <Input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
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

                <FormControl isRequired>
                  <FormLabel display="flex" alignItems="center" gap="8px">
                    <Icon as={User} boxSize="18px" />
                    Nachname
                  </FormLabel>
                  <Input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
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
              </Grid>

              <FormControl isRequired>
                <FormLabel display="flex" alignItems="center" gap="8px">
                  <Icon as={Mail} boxSize="18px" />
                  E-Mail
                </FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  borderRadius="12px"
                  bg={inputBg}
                  color={inputColor}
                  borderColor={inputBorder}
                  _hover={{ borderColor: useColorModeValue('#EB5E28', 'rgba(235, 94, 40, 0.5)') }}
                  _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 1px #EB5E28' }}
                  _placeholder={{ color: useColorModeValue('gray.400', 'gray.500') }}
                />
              </FormControl>

              <FormControl>
                <FormLabel display="flex" alignItems="center" gap="8px">
                  <Icon as={Phone} boxSize="18px" />
                  Telefon (optional)
                </FormLabel>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  borderRadius="12px"
                  bg={inputBg}
                  color={inputColor}
                  borderColor={inputBorder}
                  _hover={{ borderColor: useColorModeValue('#EB5E28', 'rgba(235, 94, 40, 0.5)') }}
                  _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 1px #EB5E28' }}
                  _placeholder={{ color: useColorModeValue('gray.400', 'gray.500') }}
                />
              </FormControl>

              <FormControl>
                <FormLabel display="flex" alignItems="center" gap="8px">
                  <Icon as={GraduationCap} boxSize="18px" />
                  Studiengang (optional)
                </FormLabel>
                <Input
                  type="text"
                  name="study_program"
                  value={formData.study_program}
                  onChange={handleChange}
                  borderRadius="12px"
                  bg={inputBg}
                  color={inputColor}
                  borderColor={inputBorder}
                  _hover={{ borderColor: useColorModeValue('#EB5E28', 'rgba(235, 94, 40, 0.5)') }}
                  _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 1px #EB5E28' }}
                  _placeholder={{ color: useColorModeValue('gray.400', 'gray.500') }}
                />
              </FormControl>

              <FormControl>
                <FormLabel display="flex" alignItems="center" gap="8px">
                  <Icon as={FileText} boxSize="18px" />
                  Notizen (optional)
                </FormLabel>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  borderRadius="12px"
                  bg={inputBg}
                  color={inputColor}
                  borderColor={inputBorder}
                  _hover={{ borderColor: useColorModeValue('#EB5E28', 'rgba(235, 94, 40, 0.5)') }}
                  _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 1px #EB5E28' }}
                  _placeholder={{ color: useColorModeValue('gray.400', 'gray.500') }}
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

export default EditParticipantModal;

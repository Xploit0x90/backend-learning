import React, { useState } from 'react';
import { User, Mail, Phone, GraduationCap, FileText } from 'lucide-react';
import { createParticipant } from '../adapter/api/useApiClient';
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

interface CreateParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateParticipantModal: React.FC<CreateParticipantModalProps> = ({ isOpen, onClose, onSuccess }) => {
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
    
    if (!formData.first_name.trim()) {
      errors.first_name = 'Der Vorname ist erforderlich';
    }
    if (!formData.last_name.trim()) {
      errors.last_name = 'Der Nachname ist erforderlich';
    }
    if (!formData.email.trim()) {
      errors.email = 'Die E-Mail-Adresse ist erforderlich';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Die E-Mail-Adresse hat ein ungültiges Format';
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
      await createParticipant({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        study_program: formData.study_program.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      });

      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        study_program: '',
        notes: '',
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      if (err?.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const backendErrors: Record<string, string> = {};
        err.response.data.errors.forEach((error: any) => {
          const fieldMap: Record<string, string> = {
            'first_name': 'first_name',
            'last_name': 'last_name',
            'email': 'email',
            'phone': 'phone',
            'study_program': 'study_program',
          };
          const frontendField = fieldMap[error.field] || error.field;
          backendErrors[frontendField] = error.message;
        });
        setFieldErrors(backendErrors);
        setError('Bitte korrigieren Sie die markierten Felder');
      } else if (err.response?.status === 409) {
        setError('Ein Teilnehmer mit dieser E-Mail existiert bereits');
        setFieldErrors({ email: 'Diese E-Mail-Adresse wird bereits verwendet' });
      } else {
        const errorMessage = err?.response?.data?.message || 
                            err?.response?.data?.error || 
                            'Fehler beim Erstellen des Teilnehmers';
        setError(errorMessage);
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
          Neuen Teilnehmer hinzufügen
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
                <FormControl isRequired isInvalid={!!fieldErrors.first_name}>
                  <FormLabel display="flex" alignItems="center" gap="8px">
                    <Icon as={User} boxSize="18px" />
                    Vorname
                  </FormLabel>
                  <Input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="z.B. Anna"
                    borderRadius="12px"
                    bg={inputBg}
                    color={inputColor}
                    borderColor={inputBorder}
                    _hover={{ borderColor: inputHoverBorder }}
                    _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 1px #EB5E28' }}
                    _placeholder={{ color: inputPlaceholderColor }}
                  />
                  <FormErrorMessage>{fieldErrors.first_name}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!fieldErrors.last_name}>
                  <FormLabel display="flex" alignItems="center" gap="8px">
                    <Icon as={User} boxSize="18px" />
                    Nachname
                  </FormLabel>
                  <Input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="z.B. Schmidt"
                    borderRadius="12px"
                    bg={inputBg}
                    color={inputColor}
                    borderColor={inputBorder}
                    _hover={{ borderColor: inputHoverBorder }}
                    _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 1px #EB5E28' }}
                    _placeholder={{ color: inputPlaceholderColor }}
                  />
                  <FormErrorMessage>{fieldErrors.last_name}</FormErrorMessage>
                </FormControl>
              </Grid>

              <FormControl isRequired isInvalid={!!fieldErrors.email}>
                <FormLabel display="flex" alignItems="center" gap="8px">
                  <Icon as={Mail} boxSize="18px" />
                  E-Mail
                </FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="anna.schmidt@stud.h-da.de"
                  borderRadius="12px"
                  bg={inputBg}
                  color={inputColor}
                  borderColor={inputBorder}
                  _hover={{ borderColor: useColorModeValue('#EB5E28', 'rgba(235, 94, 40, 0.5)') }}
                  _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 1px #EB5E28' }}
                  _placeholder={{ color: useColorModeValue('gray.400', 'gray.500') }}
                />
                <FormErrorMessage>{fieldErrors.email}</FormErrorMessage>
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
                  placeholder="+49 151 12345678"
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
                  placeholder="z.B. Informatik, 5. Semester"
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
                  placeholder="Zusätzliche Informationen..."
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
                loadingText="Erstelle..."
              >
                Teilnehmer hinzufügen
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateParticipantModal;

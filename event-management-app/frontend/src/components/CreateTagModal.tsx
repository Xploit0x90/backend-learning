import React, { useState } from 'react';
import { Tag as TagIcon, Palette } from 'lucide-react';
import { createTag } from '../adapter/api/useApiClient';
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
  FormControl,
  FormLabel,
  HStack,
  VStack,
  Box,
  Badge,
  Alert,
  AlertIcon,
  useColorModeValue,
} from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';

interface CreateTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateTagModal: React.FC<CreateTagModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#EB5E28',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presetColors = [
    '#EB5E28', '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
    '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
  ];

  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(40, 38, 36, 0.85)');
  const cardBorder = useColorModeValue('rgba(204, 197, 185, 0.3)', 'rgba(255, 255, 255, 0.08)');
  const inputBg = useColorModeValue('white', 'rgba(40, 38, 36, 0.9)');
  const inputColor = useColorModeValue('#252422', '#d4d2ce');
  const inputBorder = useColorModeValue('rgba(204, 197, 185, 0.3)', 'rgba(255, 255, 255, 0.1)');
  const inputHoverBorder = useColorModeValue('#EB5E28', 'rgba(235, 94, 40, 0.5)');
  const inputPlaceholderColor = useColorModeValue('gray.400', 'gray.500');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createTag({
        name: formData.name,
        color: formData.color,
      });

      setFormData({
        name: '',
        color: '#EB5E28',
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Ein Tag mit diesem Namen existiert bereits');
      } else if (err.response?.status === 400) {
        setError('Farbe muss im HEX-Format sein (z.B. #FF5733)');
      } else {
        setError('Fehler beim Erstellen des Tags');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent
        bg={cardBg}
        border={`1px solid ${cardBorder}`}
        backdropFilter="blur(20px)"
        borderRadius="20px"
      >
        <ModalHeader fontSize="24px" fontWeight={700}>
          Neuen Tag erstellen
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
                  <Icon as={TagIcon} boxSize="18px" />
                  Tag-Name
                </FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="z.B. Musik, Sport, Workshop..."
                  borderRadius="12px"
                  bg={inputBg}
                  color={inputColor}
                  borderColor={inputBorder}
                  _hover={{ borderColor: useColorModeValue('#EB5E28', 'rgba(235, 94, 40, 0.5)') }}
                  _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 1px #EB5E28' }}
                  _placeholder={{ color: useColorModeValue('gray.400', 'gray.500') }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel display="flex" alignItems="center" gap="8px">
                  <Icon as={Palette} boxSize="18px" />
                  Farbe
                </FormLabel>
                <HStack spacing="12px">
                  <Input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    width="80px"
                    height="40px"
                    borderRadius="8px"
                    cursor="pointer"
                  />
                  <Input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="#EB5E28"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    borderRadius="12px"
                    bg={inputBg}
                    color={inputColor}
                    borderColor={inputBorder}
                    _hover={{ borderColor: inputHoverBorder }}
                    _focus={{ borderColor: '#EB5E28', boxShadow: '0 0 0 1px #EB5E28' }}
                    _placeholder={{ color: inputPlaceholderColor }}
                  />
                </HStack>
              </FormControl>

              <FormControl>
                <FormLabel>Vordefinierte Farben</FormLabel>
                <HStack spacing="8px" flexWrap="wrap">
                  {presetColors.map((color) => (
                    <Button
                      key={color}
                      type="button"
                      width="40px"
                      height="40px"
                      borderRadius="8px"
                      bg={color}
                      border={formData.color === color ? '3px solid white' : '2px solid transparent'}
                      boxShadow={formData.color === color ? `0 0 0 2px ${color}` : 'none'}
                      _hover={{ transform: 'scale(1.1)' }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      title={color}
                    />
                  ))}
                </HStack>
              </FormControl>

              <FormControl>
                <FormLabel>Vorschau</FormLabel>
                <HStack spacing="16px">
                  <Badge
                    bg={formData.color}
                    color="white"
                    padding="8px 16px"
                    borderRadius="8px"
                    fontSize="14px"
                    fontWeight={600}
                  >
                    {formData.name || 'Tag Name'}
                  </Badge>
                  <Box
                    width="40px"
                    height="40px"
                    borderRadius="50%"
                    bg={formData.color}
                    border={`2px solid ${cardBorder}`}
                  />
                </HStack>
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
                Tag erstellen
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateTagModal;

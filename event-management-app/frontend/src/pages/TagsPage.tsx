import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tag as TagType } from '../types';
import { Tag as TagIcon, Plus, Search, Edit2, Trash2, Calendar, Eye } from 'lucide-react';
import CreateTagModal from '../components/CreateTagModal';
import { getAllTags, deleteTag } from '../adapter/api/useApiClient';
import EditTagModal from '../components/EditTagModal';
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
  Badge,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';

const TagsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
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

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadTags = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllTags();
      setTags(data);
      setError(null);
    } catch (err) {
      setError(t('tags.loadError'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  const handleDeleteTag = async (id: number, name: string) => {
    if (window.confirm(t('tags.deleteConfirm', { name }))) {
      try {
        await deleteTag(id);
        loadTags();
        toast({
          title: t('tags.deleted'),
          description: t('tags.deletedDescription', { name }),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: t('common.error'),
          description: t('tags.deleteError'),
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
        {t('tags.loading')}
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
              <Icon as={TagIcon} boxSize={{ base: '24px', md: '28px', lg: '32px' }} />
              {t('tags.title')}
            </Heading>
            <Text fontSize={{ base: '14px', md: '15px' }} color={textColor}>
              {t('tags.subtitle')}
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
            {t('tags.newTag')}
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
        overflow="hidden"
      >
        <Grid 
          templateColumns={{ base: '1fr', sm: 'repeat(3, 1fr)' }} 
          gap={{ base: '16px', md: '20px' }}
          width="100%"
        >
          <VStack spacing="8px" width="100%" minWidth="0" overflow="hidden">
            <Heading 
              fontSize={{ base: '28px', md: '32px' }} 
              fontWeight={800} 
              color="#EB5E28"
              wordBreak="break-word"
              overflow="hidden"
              lineHeight="1"
            >
              {tags.length}
            </Heading>
            <Text 
              fontSize={{ base: '13px', md: '14px' }} 
              color={textColor} 
              fontWeight={600}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              width="100%"
              textAlign="center"
            >
              {t('tags.totalTags')}
            </Text>
          </VStack>
          <VStack spacing="8px" width="100%" minWidth="0" overflow="hidden">
            <Heading 
              fontSize={{ base: '28px', md: '32px' }} 
              fontWeight={800} 
              color="#10B981"
              wordBreak="break-word"
              overflow="hidden"
              lineHeight="1"
            >
              {tags.filter(t => (t.event_count || 0) > 0).length}
            </Heading>
            <Text 
              fontSize={{ base: '13px', md: '14px' }} 
              color={textColor} 
              fontWeight={600}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              width="100%"
              textAlign="center"
            >
              {t('tags.used')}
            </Text>
          </VStack>
          <VStack spacing="8px" width="100%" minWidth="0" overflow="hidden">
            <Heading 
              fontSize={{ base: '28px', md: '32px' }} 
              fontWeight={800} 
              color="#6B7280"
              wordBreak="break-word"
              overflow="hidden"
              lineHeight="1"
            >
              {tags.filter(t => (t.event_count || 0) === 0).length}
            </Heading>
            <Text 
              fontSize={{ base: '13px', md: '14px' }} 
              color={textColor} 
              fontWeight={600}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              width="100%"
              textAlign="center"
            >
              {t('tags.unused')}
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
            placeholder={t('tags.searchPlaceholder')}
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

      {/* Tags Grid */}
      {filteredTags.length === 0 ? (
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
            <Icon as={TagIcon} boxSize="64px" opacity={0.3} />
            <VStack spacing="8px">
              <Heading fontSize="24px" color={titleColor}>
                {t('tags.noTags')}
              </Heading>
              <Text fontSize="16px" color={textColor}>
                {searchQuery ? t('common.tryDifferentSearch') : t('tags.createFirstTag')}
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
              {t('tags.createTag')}
            </Button>
          </VStack>
        </Card>
      ) : (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="20px" mb="30px">
          {filteredTags.map((tag) => (
            <Card
              key={tag.id}
              bg={cardBg}
              border={`1px solid ${cardBorder}`}
              boxShadow={cardShadow}
              backdropFilter="blur(20px)"
              borderRadius="16px"
              padding={{ base: '16px', md: '20px', lg: '24px' }}
              cursor="pointer"
              transition="all 0.3s ease"
              overflow="hidden"
              minWidth="0"
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                borderColor: tag.color,
              }}
              onClick={() => navigate(`/tags/${tag.id}`)}
            >
              <VStack align="stretch" spacing={{ base: '12px', md: '16px' }} minWidth="0">
                <Flex alignItems="center" gap={{ base: '12px', md: '16px' }} flexWrap="wrap" minWidth="0">
                  <Box
                    width={{ base: '40px', md: '48px' }}
                    height={{ base: '40px', md: '48px' }}
                    borderRadius="12px"
                    bg={tag.color}
                    flexShrink={0}
                  />
                  <VStack align="flex-start" spacing="4px" flex="1" minWidth="0">
                    <Heading 
                      fontSize={{ base: '18px', md: '20px' }} 
                      fontWeight={700} 
                      color={titleColor} 
                      noOfLines={1}
                      wordBreak="break-word"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {tag.name}
                    </Heading>
                    <HStack spacing="8px" fontSize={{ base: '12px', md: '13px' }} color={textColor} flexWrap="wrap" minWidth="0">
                      <Icon as={Calendar} boxSize="16px" flexShrink={0} />
                      <Text>
                        {t('participants.eventCount', { count: tag.event_count || 0 })}
                      </Text>
                    </HStack>
                  </VStack>
                </Flex>

                <Badge
                  bg={tag.color}
                  color="white"
                  padding="6px 12px"
                  borderRadius="8px"
                  fontSize="12px"
                  fontWeight={600}
                  width="fit-content"
                  maxWidth="100%"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {tag.name}
                </Badge>

                <Flex 
                  gap="8px" 
                  flexWrap="wrap" 
                  onClick={(e) => e.stopPropagation()}
                  direction={{ base: 'column', sm: 'row' }}
                >
                  <Button
                    size="sm"
                    leftIcon={<Icon as={Eye} boxSize="18px" />}
                    bg="rgba(235, 94, 40, 0.1)"
                    color="#EB5E28"
                    _hover={{ bg: 'rgba(235, 94, 40, 0.2)' }}
                    borderRadius="8px"
                    minHeight="44px"
                    padding="10px 16px"
                    onClick={() => navigate(`/tags/${tag.id}`)}
                    flex={{ base: '1', sm: '0 1 auto' }}
                    width={{ base: '100%', sm: 'auto' }}
                  >
                    {t('common.view')}
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<Icon as={Edit2} boxSize="18px" />}
                    bg="rgba(59, 130, 246, 0.1)"
                    color="#3B82F6"
                    _hover={{ bg: 'rgba(59, 130, 246, 0.2)' }}
                    borderRadius="8px"
                    minHeight="44px"
                    padding="10px 16px"
                    onClick={() => setEditingTag(tag)}
                    flex={{ base: '1', sm: '0 1 auto' }}
                    width={{ base: '100%', sm: 'auto' }}
                  >
                    {t('common.edit')}
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<Icon as={Trash2} boxSize="18px" />}
                    bg="rgba(239, 68, 68, 0.1)"
                    color="#ef4444"
                    _hover={{ bg: 'rgba(239, 68, 68, 0.2)' }}
                    borderRadius="8px"
                    minHeight="44px"
                    padding="10px 16px"
                    onClick={() => handleDeleteTag(tag.id, tag.name)}
                    flex={{ base: '1', sm: '0 1 auto' }}
                    width={{ base: '100%', sm: 'auto' }}
                  >
                    {t('common.delete')}
                  </Button>
                </Flex>
              </VStack>
            </Card>
          ))}
        </Grid>
      )}

      {/* Popular Tags Section */}
      {tags.length > 0 && (
        <Card
          bg={cardBg}
          border={`1px solid ${cardBorder}`}
          boxShadow={cardShadow}
          backdropFilter="blur(20px)"
          borderRadius="20px"
          padding={{ base: '20px', md: '30px' }}
        >
          <Heading 
            fontSize={{ base: '20px', md: '24px' }} 
            fontWeight={700} 
            color={titleColor} 
            mb="20px"
          >
            {t('tags.popularTags')}
          </Heading>
          <Flex gap={{ base: '8px', md: '12px' }} flexWrap="wrap">
            {tags
              .sort((a, b) => (b.event_count || 0) - (a.event_count || 0))
              .slice(0, 10)
              .map((tag) => (
                <Box
                  key={tag.id}
                  border={`2px solid ${tag.color}`}
                  borderRadius="12px"
                  padding="12px 16px"
                  cursor="pointer"
                  transition="all 0.3s ease"
                  bg={isDark ? 'rgba(50, 48, 46, 0.5)' : 'rgba(255, 255, 255, 0.5)'}
                  _hover={{
                    bg: isDark ? 'rgba(50, 48, 46, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${tag.color}40`,
                  }}
                  onClick={() => navigate(`/tags/${tag.id}`)}
                >
                  <HStack spacing="8px">
                    <Box
                      width="8px"
                      height="8px"
                      borderRadius="50%"
                      bg={tag.color}
                    />
                    <Text fontSize="14px" fontWeight={600} color={titleColor}>
                      {tag.name}
                    </Text>
                    <Badge
                      bg={tag.color}
                      color="white"
                      padding="2px 8px"
                      borderRadius="6px"
                      fontSize="11px"
                      fontWeight={600}
                    >
                      {tag.event_count || 0}
                    </Badge>
                  </HStack>
                </Box>
              ))}
          </Flex>
        </Card>
      )}

      {/* Modals */}
      <CreateTagModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={loadTags} />

      {editingTag && (
        <EditTagModal
          isOpen={true}
          onClose={() => setEditingTag(null)}
          onSuccess={() => {
            loadTags();
            setEditingTag(null);
          }}
          tag={editingTag}
        />
      )}
    </Box>
  );
};

export default TagsPage;

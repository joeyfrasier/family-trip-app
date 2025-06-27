import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Group,
  Badge,
  Stack,
  Alert,
  Button,
  Box,
  Overlay,
  Image,
  Skeleton
} from '@mantine/core';
import {
  IconMapPin,
  IconCalendar,
  IconUsers,
  IconRefresh,
  IconAlertCircle,
  IconSettings
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { getCurrentCityImage, getRandomCityImage } from '../services/cityImageService';
import type { Trip } from '../types/trip';

interface TripHeaderProps {
  tripData: Trip;
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
  onAdminClick: () => void;
}

export default function TripHeader({
  tripData,
  loading,
  error,
  onRefetch,
  onAdminClick
}: TripHeaderProps) {
  const { title, startDate, endDate, totalDays, countries, familyMembers, destinations } = tripData;
  const [currentImage, setCurrentImage] = useState<{ url: string; alt: string; credit: string } | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Get current city image or fallback to a random one
    const image = getCurrentCityImage(destinations) || getRandomCityImage(destinations);
    if (image) {
      setCurrentImage(image);
      setImageLoading(true);
      setImageError(false);
    }
  }, [destinations]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <Box
      style={{
        position: 'relative',
        minHeight: 'clamp(250px, 40vh, 350px)',
        background: currentImage && !imageError
          ? 'transparent'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        overflow: 'hidden'
      }}
    >
      {/* Background Image */}
      {currentImage && !imageError && (
        <>
          {imageLoading && (
            <Skeleton
              height="100%"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1
              }}
            />
          )}
          <Image
            src={currentImage.url}
            alt={currentImage.alt}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 1
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          <Overlay
            opacity={0.4}
            style={{ zIndex: 2 }}
          />
        </>
      )}

      {/* Header Content */}
      <Container
        size="lg"
        style={{
          position: 'relative',
          zIndex: 3,
          paddingTop: '2rem',
          paddingBottom: '2rem'
        }}
      >
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <Title
              order={1}
              c="white"
              style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                fontWeight: 700,
                lineHeight: 1.2
              }}
            >
              {title}
            </Title>
            <Group gap="sm">
              <Button
                variant="white"
                leftSection={<IconRefresh size={16} />}
                onClick={onRefetch}
                size="sm"
                loading={loading}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
              >
                Refresh
              </Button>
              <Button
                variant="light"
                leftSection={<IconSettings size={16} />}
                onClick={onAdminClick}
                size="sm"
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  color: '#333',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                Admin
              </Button>
            </Group>
          </Group>

          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="yellow"
              variant="light"
              style={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(8px)'
              }}
            >
              {error}
            </Alert>
          )}

          <Group gap="xl" wrap="wrap">
            <Group gap="xs">
              <IconCalendar size={18} color="white" />
              <Text size="sm" c="white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                {format(new Date(startDate), 'MMM d')} - {format(new Date(endDate), 'MMM d, yyyy')}
              </Text>
              <Badge
                variant="white"
                color="blue"
                style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
              >
                {totalDays} days
              </Badge>
            </Group>
            <Group gap="xs">
              <IconMapPin size={18} color="white" />
              <Text size="sm" c="white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                {countries.join(' • ')}
              </Text>
            </Group>
            <Group gap="xs">
              <IconUsers size={18} color="white" />
              <Text size="sm" c="white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                {familyMembers.length} family members
              </Text>
            </Group>
          </Group>

          <Group justify="space-between" align="flex-end">
            <Text
              size="xs"
              c="white"
              style={{
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                opacity: 0.9
              }}
            >
              Last updated: {format(new Date(tripData.lastUpdated), 'MMM d, yyyy \'at\' h:mm a')}
            </Text>
            {currentImage && !imageError && (
              <Text
                size="xs"
                c="white"
                style={{
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  opacity: 0.7
                }}
              >
                {currentImage.credit}
              </Text>
            )}
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}
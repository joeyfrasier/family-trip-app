import {
  Card,
  Text,
  Title,
  Group,
  Stack,
  Badge,
  Anchor,
  Grid,
  Box,
  Flex,
  Center
} from '@mantine/core'
import {
  IconMapPin,
  IconCalendar,
  IconBed,
  IconExternalLink,
  IconCheck,
  IconAlertTriangle,
  IconPlane,
  IconTrain,
  IconCar,
  IconShip
} from '@tabler/icons-react'
import { format, differenceInDays } from 'date-fns'
import type { Destination } from '../types/trip'

interface DestinationCardProps {
  destination: Destination
  isFirst: boolean
  isLast: boolean
}

const getTransportIcon = (type: string) => {
  switch (type) {
    case 'flight': return IconPlane
    case 'train': return IconTrain
    case 'car': return IconCar
    case 'ferry': return IconShip
    default: return IconMapPin
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'green'
    case 'pending': return 'yellow'
    case 'to-book': return 'red'
    default: return 'gray'
  }
}

const DestinationCard = ({ destination }: DestinationCardProps) => {
  const nights = differenceInDays(new Date(destination.endDate), new Date(destination.startDate))
  const startDate = format(new Date(destination.startDate), 'MMM d')
  const endDate = format(new Date(destination.endDate), 'MMM d')
  const TransportIcon = destination.inboundTransport ? getTransportIcon(destination.inboundTransport.type) : null

  return (
    <Card shadow="lg" radius="xl" style={{ overflow: 'hidden', position: 'relative', zIndex: 1 }}>
      <Grid gutter={0}>
        {/* Left side - Image placeholder */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Box
            h={250}
            bg="gray.1"
            pos="relative"
            style={{
              borderTopLeftRadius: 'var(--mantine-radius-xl)',
              borderBottomLeftRadius: 'var(--mantine-radius-xl)'
            }}
          >
            <Center h="100%" style={{ flexDirection: 'column', gap: '0.5rem' }}>
              <Text size="4rem" style={{ lineHeight: 1 }}>
                {destination.flag}
              </Text>
              <Text fw={500} c="dimmed">
                {destination.city}
              </Text>
            </Center>
            
            {/* Dates overlay */}
            <Card
              shadow="sm"
              radius="md"
              pos="absolute"
              top={16}
              left={16}
              p="xs"
              style={{ backgroundColor: 'white' }}
            >
              <Text size="sm" fw={600} c="dark">
                {startDate} - {endDate}
              </Text>
              <Text size="xs" c="dimmed">
                {nights} nights
              </Text>
            </Card>
          </Box>
        </Grid.Col>

        {/* Right side - Details */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg" p="xl">
            {/* Header */}
            <Flex justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Group gap="xs">
                  <Title order={2} c="dark">
                    {destination.city}
                  </Title>
                  <Text size="lg" c="dimmed">
                    {destination.country}
                  </Text>
                </Group>
                <Group gap="xs" c="dimmed">
                  <IconCalendar size={16} />
                  <Text size="sm">
                    {startDate} - {endDate} • {nights} nights
                  </Text>
                </Group>
              </Stack>
              <Text size="2rem" style={{ lineHeight: 1 }}>
                {destination.flag}
              </Text>
            </Flex>

            {/* Accommodation */}
            {destination.accommodation && (
              <Stack gap="xs">
                <Group justify="space-between">
                  <Group gap="xs">
                    <IconBed size={18} />
                    <Text fw={500} c="dark">
                      Accommodation
                    </Text>
                  </Group>
                  <Badge
                    variant="light"
                    color={destination.accommodation.confirmed ? 'green' : 'red'}
                    leftSection={destination.accommodation.confirmed ? <IconCheck size={12} /> : <IconAlertTriangle size={12} />}
                  >
                    {destination.accommodation.confirmed ? 'Confirmed' : 'To Book'}
                  </Badge>
                </Group>
                
                <Stack gap="xs" pl="xl">
                  <Text size="sm" fw={500}>
                    {destination.accommodation.name}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {destination.accommodation.address}
                  </Text>
                  <Group gap="md">
                    <Text size="xs" c="dimmed">
                      {destination.accommodation.guests} guests
                    </Text>
                    <Text size="xs" c="dimmed" tt="uppercase">
                      {destination.accommodation.type}
                    </Text>
                  </Group>
                  {destination.accommodation.bookingUrl && (
                    <Anchor 
                      href={destination.accommodation.bookingUrl} 
                      target="_blank"
                      size="sm"
                      c="blue"
                    >
                      <Group gap="xs">
                        <span>View booking</span>
                        <IconExternalLink size={14} />
                      </Group>
                    </Anchor>
                  )}
                </Stack>
              </Stack>
            )}

            {/* Transportation */}
            {destination.inboundTransport && TransportIcon && (
              <Stack gap="xs">
                <Group gap="xs">
                  <TransportIcon size={18} />
                  <Text fw={500} c="dark">
                    Arriving by {destination.inboundTransport.type}
                  </Text>
                  <Badge
                    variant="light"
                    color={getStatusColor(destination.inboundTransport.status)}
                    size="sm"
                  >
                    {destination.inboundTransport.status}
                  </Badge>
                </Group>
                
                <Stack gap="xs" pl="xl">
                  <Text size="sm">
                    {destination.inboundTransport.from} → {destination.inboundTransport.to}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {destination.inboundTransport.details || 
                     `${destination.inboundTransport.departureTime || ''} ${destination.inboundTransport.provider || ''}`.trim()}
                  </Text>
                  {destination.inboundTransport.bookingUrl && (
                    <Anchor 
                      href={destination.inboundTransport.bookingUrl} 
                      target="_blank"
                      size="sm"
                      c="blue"
                    >
                      <Group gap="xs">
                        <span>View booking</span>
                        <IconExternalLink size={14} />
                      </Group>
                    </Anchor>
                  )}
                </Stack>
              </Stack>
            )}

            {/* Key Events */}
            {destination.keyEvents.length > 0 && (
              <Stack gap="xs">
                <Text fw={500} c="dark">
                  Key Events
                </Text>
                <Stack gap="xs" pl="md">
                  {destination.keyEvents.map((event, index) => (
                    <Text key={index} size="sm" c="dimmed">
                      • {event}
                    </Text>
                  ))}
                </Stack>
              </Stack>
            )}
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  )
}

export default DestinationCard
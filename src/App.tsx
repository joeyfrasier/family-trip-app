import { Container, Title, Text, Group, Badge, Stack, Paper, Alert, Button, Loader, Center } from '@mantine/core'
import { IconMapPin, IconCalendar, IconUsers, IconRefresh, IconAlertCircle } from '@tabler/icons-react'
import { format } from 'date-fns'
import { useTripData } from './hooks/useTripData'
import TripTimeline from './components/TripTimeline'

function App() {
  const { tripData, loading, error, refetch } = useTripData()
  const { title, startDate, endDate, totalDays, countries, familyMembers } = tripData

  if (loading) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text>Loading latest trip data...</Text>
        </Stack>
      </Center>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <Paper shadow="sm" p="md" mb="xl">
        <Container size="lg">
          <Stack gap="md">
            <Group justify="space-between" align="flex-start">
              <Title order={1} c="dark">
                {title}
              </Title>
              <Button
                variant="light"
                leftSection={<IconRefresh size={16} />}
                onClick={refetch}
                size="sm"
              >
                Refresh
              </Button>
            </Group>
            
            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="yellow" variant="light">
                {error}
              </Alert>
            )}
            
            <Group gap="xl">
              <Group gap="xs">
                <IconCalendar size={18} />
                <Text size="sm">
                  {format(new Date(startDate), 'MMM d')} - {format(new Date(endDate), 'MMM d, yyyy')}
                </Text>
                <Badge variant="light" color="blue">
                  {totalDays} days
                </Badge>
              </Group>
              <Group gap="xs">
                <IconMapPin size={18} />
                <Text size="sm">
                  {countries.join(' • ')}
                </Text>
              </Group>
              <Group gap="xs">
                <IconUsers size={18} />
                <Text size="sm">
                  {familyMembers.length} family members
                </Text>
              </Group>
            </Group>
            
            <Text size="xs" c="dimmed">
              Last updated: {format(new Date(tripData.lastUpdated), 'MMM d, yyyy \'at\' h:mm a')}
            </Text>
          </Stack>
        </Container>
      </Paper>

      {/* Main Content */}
      <Container size="lg" pb="xl">
        <TripTimeline />
      </Container>
    </div>
  )
}

export default App
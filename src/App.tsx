import { Container, Title, Text, Group, Badge, Stack, Paper, Alert, Button, Loader, Center } from '@mantine/core'
import { IconMapPin, IconCalendar, IconUsers, IconRefresh, IconAlertCircle, IconSettings } from '@tabler/icons-react'
import { format } from 'date-fns'
import { useState } from 'react'
import { useTripData } from './hooks/useTripData'
import TripTimeline from './components/TripTimeline'
import AdminInterface from './components/AdminInterface'

function App() {
  const { tripData, loading, error, refetch } = useTripData()
  const { title, startDate, endDate, totalDays, countries, familyMembers } = tripData
  const [adminModalOpened, setAdminModalOpened] = useState(false)

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
              <Group gap="sm">
                <Button
                  variant="light"
                  leftSection={<IconRefresh size={16} />}
                  onClick={refetch}
                  size="sm"
                >
                  Refresh
                </Button>
                <Button
                  variant="subtle"
                  leftSection={<IconSettings size={16} />}
                  onClick={() => setAdminModalOpened(true)}
                  size="sm"
                >
                  Admin
                </Button>
              </Group>
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

      {/* Admin Interface */}
      <AdminInterface 
        opened={adminModalOpened} 
        onClose={() => setAdminModalOpened(false)} 
      />
    </div>
  )
}

export default App
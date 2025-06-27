import { Container, Title, Text, Group, Badge, Stack, Paper } from '@mantine/core'
import { IconMapPin, IconCalendar, IconUsers } from '@tabler/icons-react'
import { format } from 'date-fns'
import { tripData } from './data/tripData'
import TripTimeline from './components/TripTimeline'

function App() {
  const { title, startDate, endDate, totalDays, countries, familyMembers } = tripData

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <Paper shadow="sm" p="md" mb="xl">
        <Container size="lg">
          <Stack gap="md">
            <Title order={1} c="dark">
              {title}
            </Title>
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
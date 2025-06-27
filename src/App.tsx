import { Container, Loader, Center, Stack, Text } from '@mantine/core'
import { useState } from 'react'
import { useTripData } from './hooks/useTripData'
import TripTimeline from './components/TripTimeline'
import TripHeader from './components/TripHeader'
import AdminInterface from './components/AdminInterface'

function App() {
  const { tripData, loading, error, refetch } = useTripData()
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
      {/* Header with City Image */}
      <TripHeader
        tripData={tripData}
        loading={loading}
        error={error}
        onRefetch={refetch}
        onAdminClick={() => setAdminModalOpened(true)}
      />

      {/* Main Content */}
      <Container size="lg" py="xl">
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
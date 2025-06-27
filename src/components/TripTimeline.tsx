import { Stack, Box } from '@mantine/core'
import { useTripData } from '../hooks/useTripData'
import DestinationCard from './DestinationCard'

const TripTimeline = () => {
  const { tripData } = useTripData()
  
  return (
    <Stack gap="xl">
      {tripData.destinations.map((destination, index) => (
        <Box key={destination.id} pos="relative">
          <DestinationCard 
            destination={destination} 
            isFirst={index === 0}
            isLast={index === tripData.destinations.length - 1}
          />
          
          {/* Connection line to next destination */}
          {index < tripData.destinations.length - 1 && (
            <Box
              pos="absolute"
              left="50%"
              bottom="-18px"
              style={{
                transform: 'translateX(-50%)',
                width: '2px',
                height: '18px',
                backgroundColor: '#dee2e6',
                zIndex: 0
              }}
            />
          )}
        </Box>
      ))}
    </Stack>
  )
}

export default TripTimeline
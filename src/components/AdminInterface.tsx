import { useState } from 'react';
import {
  Modal,
  Button,
  Stack,
  Textarea,
  Alert,
  Text,
  PasswordInput,
  Group,
  Paper,
  Title,
  Loader,
  Code,
  Divider
} from '@mantine/core';
import { IconAlertCircle, IconCheck, IconDownload } from '@tabler/icons-react';
import { parseConfirmationText, type ParsedTravelData } from '../services/aiParsingService';
import { generateCSVData, downloadCSV, type CSVData } from '../services/googleSheetsWriteService';

interface AdminInterfaceProps {
  opened: boolean;
  onClose: () => void;
}

const ADMIN_PASSWORD = 'familytrip2024'; // Simple password for demo

export default function AdminInterface({ opened, onClose }: AdminInterfaceProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedTravelData | null>(null);
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Incorrect password');
    }
  };

  const handleParseConfirmation = async () => {
    if (!confirmationText.trim()) {
      setError('Please enter confirmation text to parse');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setParsedData(null);
    setCsvData(null);

    try {
      const parsed = await parseConfirmationText(confirmationText);
      setParsedData(parsed);
      
      const csv = generateCSVData(parsed);
      setCsvData(csv);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse confirmation');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadCSV = (csvContent: string, type: string) => {
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(csvContent, `${type}_${timestamp}.csv`);
  };

  const handleClose = () => {
    setIsAuthenticated(false);
    setPassword('');
    setConfirmationText('');
    setParsedData(null);
    setCsvData(null);
    setError(null);
    onClose();
  };

  if (!isAuthenticated) {
    return (
      <Modal opened={opened} onClose={handleClose} title="Admin Access" centered>
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Enter the admin password to access the AI parsing interface
          </Text>
          
          <PasswordInput
            label="Password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
          />
          
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {error}
            </Alert>
          )}
          
          <Group justify="flex-end">
            <Button variant="light" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit}>
              Access Admin
            </Button>
          </Group>
        </Stack>
      </Modal>
    );
  }

  return (
    <Modal 
      opened={opened} 
      onClose={handleClose} 
      title="AI Travel Confirmation Parser" 
      size="xl"
      centered
    >
      <Stack gap="lg">
        <Text size="sm" c="dimmed">
          Paste your travel confirmation email or booking details below. The AI will extract structured data and generate CSV files for your Google Sheets.
        </Text>
        
        <Textarea
          label="Travel Confirmation Text"
          placeholder="Paste your confirmation email, booking details, or travel itinerary here..."
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.currentTarget.value)}
          minRows={6}
          maxRows={12}
        />
        
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            {error}
          </Alert>
        )}
        
        <Group justify="flex-end">
          <Button 
            variant="light" 
            onClick={handleClose}
          >
            Close
          </Button>
          <Button 
            onClick={handleParseConfirmation}
            loading={isProcessing}
            disabled={!confirmationText.trim()}
          >
            {isProcessing ? 'Parsing...' : 'Parse with AI'}
          </Button>
        </Group>
        
        {isProcessing && (
          <Paper p="md" withBorder>
            <Group>
              <Loader size="sm" />
              <Text size="sm">Processing your confirmation with AI...</Text>
            </Group>
          </Paper>
        )}
        
        {parsedData && (
          <Paper p="md" withBorder>
            <Stack gap="md">
              <Group>
                <IconCheck size={16} color="green" />
                <Title order={4}>Parsing Complete</Title>
              </Group>
              
              <Text size="sm" c="dimmed">
                Extracted the following information:
              </Text>
              
              <Code block>
                {JSON.stringify(parsedData, null, 2)}
              </Code>
              
              {csvData && (
                <>
                  <Divider />
                  <Title order={5}>Generated CSV Files</Title>
                  <Text size="sm" c="dimmed">
                    Download these CSV files and paste their contents into your Google Sheets:
                  </Text>
                  
                  <Stack gap="xs">
                    {csvData.destinations && (
                      <Group justify="space-between">
                        <Text size="sm">Destinations CSV</Text>
                        <Button 
                          size="xs" 
                          variant="light"
                          leftSection={<IconDownload size={14} />}
                          onClick={() => handleDownloadCSV(csvData.destinations!, 'destinations')}
                        >
                          Download
                        </Button>
                      </Group>
                    )}
                    
                    {csvData.accommodations && (
                      <Group justify="space-between">
                        <Text size="sm">Accommodations CSV</Text>
                        <Button 
                          size="xs" 
                          variant="light"
                          leftSection={<IconDownload size={14} />}
                          onClick={() => handleDownloadCSV(csvData.accommodations!, 'accommodations')}
                        >
                          Download
                        </Button>
                      </Group>
                    )}
                    
                    {csvData.transportation && (
                      <Group justify="space-between">
                        <Text size="sm">Transportation CSV</Text>
                        <Button 
                          size="xs" 
                          variant="light"
                          leftSection={<IconDownload size={14} />}
                          onClick={() => handleDownloadCSV(csvData.transportation!, 'transportation')}
                        >
                          Download
                        </Button>
                      </Group>
                    )}
                  </Stack>
                </>
              )}
            </Stack>
          </Paper>
        )}
      </Stack>
    </Modal>
  );
}
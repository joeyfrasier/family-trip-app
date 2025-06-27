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
  Code
} from '@mantine/core';
import { IconAlertCircle, IconCheck, IconDownload } from '@tabler/icons-react';
import { parseConfirmationText, type ParsedTravelData } from '../services/aiParsingService';
import { 
  generateSheetChanges, 
  applyChangesToSheets,
  generateCSVFromChanges,
  downloadCSV, 
  type ChangePreview 
} from '../services/googleSheetsWriteService';

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
  const [changePreview, setChangePreview] = useState<ChangePreview | null>(null);
  const [isApplyingChanges, setIsApplyingChanges] = useState(false);
  const [applyResult, setApplyResult] = useState<{ success: boolean; message: string } | null>(null);
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
    setChangePreview(null);
    setApplyResult(null);

    try {
      const parsed = await parseConfirmationText(confirmationText);
      setParsedData(parsed);
      
      const preview = generateSheetChanges(parsed);
      setChangePreview(preview);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse confirmation');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyChanges = async () => {
    if (!changePreview?.changes.length) {
      setError('No changes to apply');
      return;
    }

    setIsApplyingChanges(true);
    setError(null);
    setApplyResult(null);

    try {
      const result = await applyChangesToSheets(changePreview.changes);
      setApplyResult(result);
      
      if (result.success) {
        // Optionally refresh the data or show success message
        setTimeout(() => {
          window.location.reload(); // Refresh to show updated data
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply changes');
    } finally {
      setIsApplyingChanges(false);
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
    setChangePreview(null);
    setApplyResult(null);
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
            </Stack>
          </Paper>
        )}

        {changePreview && (
          <Paper p="md" withBorder>
            <Stack gap="md">
              <Title order={4}>Proposed Changes</Title>
              
              <Text size="sm" c="dimmed">
                Review the changes that will be made to your Google Sheets:
              </Text>
              
              <Code block>
                {changePreview.summary}
              </Code>
              
              {changePreview.changes.length > 0 && (
                <>
                  <Group justify="space-between">
                    <Button
                      variant="light"
                      leftSection={<IconDownload size={14} />}
                      onClick={() => {
                        const csvData = generateCSVFromChanges(changePreview.changes);
                        Object.entries(csvData).forEach(([type, content]) => {
                          handleDownloadCSV(content, type);
                        });
                      }}
                    >
                      Download as CSV (Manual)
                    </Button>
                    
                    <Button
                      color="green"
                      loading={isApplyingChanges}
                      onClick={handleApplyChanges}
                      disabled={applyResult?.success}
                    >
                      {isApplyingChanges ? 'Applying Changes...' : 'Apply to Google Sheets'}
                    </Button>
                  </Group>
                  
                  {applyResult && (
                    <Alert
                      icon={<IconCheck size={16} />}
                      color={applyResult.success ? 'green' : 'red'}
                    >
                      {applyResult.message}
                      {applyResult.success && (
                        <Text size="sm" mt="xs">
                          Changes applied successfully! The app will refresh in 2 seconds to show updated data.
                        </Text>
                      )}
                    </Alert>
                  )}
                </>
              )}
            </Stack>
          </Paper>
        )}
      </Stack>
    </Modal>
  );
}
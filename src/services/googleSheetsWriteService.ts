import type { ParsedTravelData } from './aiParsingService';

// Interface for proposed changes
export interface SheetChange {
  sheet: 'Destinations' | 'Accommodations' | 'Transportation';
  action: 'add' | 'update';
  rowIndex?: number; // For updates
  data: string[];
  description: string;
}

// Interface for change preview
export interface ChangePreview {
  changes: SheetChange[];
  summary: string;
}

// Map parsed data to sheet row format
export const generateSheetChanges = (parsedData: ParsedTravelData): ChangePreview => {
  const changes: SheetChange[] = [];
  
  // Generate destination row if we have location and date info
  if (parsedData.city && parsedData.startDate) {
    const destinationRow = [
      parsedData.city.toLowerCase().replace(/\s+/g, '-'), // Generate ID
      parsedData.city,
      parsedData.country || '',
      '', // countryCode - would need to be filled manually
      '', // flag - would need to be filled manually  
      parsedData.startDate,
      parsedData.endDate || '',
      parsedData.accommodation_name || '',
      parsedData.accommodation_type || '',
      parsedData.accommodation_address || '',
      parsedData.accommodation_confirmed ? 'true' : 'false',
      parsedData.accommodation_guests?.toString() || '',
      parsedData.accommodation_bookingUrl || '',
      parsedData.transport_type || '',
      parsedData.transport_from || '',
      parsedData.transport_to || '',
      parsedData.transport_date || '',
      parsedData.transport_time || '',
      parsedData.transport_provider || '',
      parsedData.transport_status || '',
      parsedData.transport_bookingUrl || '',
      parsedData.notes || ''
    ];
    
    changes.push({
      sheet: 'Destinations',
      action: 'add',
      data: destinationRow,
      description: `Add new destination: ${parsedData.city} (${parsedData.startDate} - ${parsedData.endDate})`
    });
  }
  
  // Generate summary
  let summary = `Found ${changes.length} proposed changes:\n`;
  changes.forEach((change, index) => {
    summary += `${index + 1}. ${change.description}\n`;
  });
  
  if (changes.length === 0) {
    summary = 'No actionable changes detected from the parsed data.';
  }
  
  return {
    changes,
    summary
  };
};

// Google Apps Script Web App URL for writing to sheets
// This would be deployed as a Google Apps Script and the URL provided here
const APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';

// Function to actually apply changes to Google Sheets
export const applyChangesToSheets = async (changes: SheetChange[]): Promise<{ success: boolean; message: string }> => {
  if (!APPS_SCRIPT_URL) {
    throw new Error('Google Apps Script URL not configured. Please set VITE_GOOGLE_APPS_SCRIPT_URL environment variable.');
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateSheet',
        changes: changes
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error applying changes to Google Sheets:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Convert sheet changes to CSV format for manual import
export const generateCSVFromChanges = (changes: SheetChange[]): Record<string, string> => {
  const csvData: Record<string, string> = {};
  
  changes.forEach(change => {
    if (change.sheet === 'Destinations') {
      const headers = [
        'ID', 'City', 'Country', 'CountryCode', 'Flag', 'StartDate', 'EndDate',
        'AccommodationName', 'AccommodationType', 'AccommodationAddress', 
        'AccommodationConfirmed', 'AccommodationGuests', 'AccommodationBookingUrl',
        'TransportType', 'TransportFrom', 'TransportTo', 'TransportDate',
        'TransportTime', 'TransportProvider', 'TransportStatus', 'TransportBookingUrl',
        'KeyEvents'
      ];
      
      csvData.destinations = headers.join(',') + '\n' + change.data.join(',');
    }
  });
  
  return csvData;
};
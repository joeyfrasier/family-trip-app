import type { ParsedTravelData } from './aiParsingService';

export interface CSVData {
  destinations?: string;
  accommodations?: string;
  transportation?: string;
}

export const generateCSVData = (parsedData: ParsedTravelData): CSVData => {
  const csvData: CSVData = {};
  
  // Generate destinations CSV if we have location and date info
  if (parsedData.city || parsedData.startDate) {
    const destinationRow = [
      parsedData.city || '',
      parsedData.country || '',
      parsedData.startDate || '',
      parsedData.endDate || '',
      '1', // totalDays - could be calculated
      parsedData.notes || ''
    ].join(',');
    
    csvData.destinations = `City,Country,StartDate,EndDate,TotalDays,Notes\n${destinationRow}`;
  }
  
  // Generate accommodations CSV if we have accommodation info
  if (parsedData.accommodation_name) {
    const accommodationRow = [
      parsedData.city || '',
      parsedData.accommodation_name || '',
      parsedData.accommodation_type || '',
      parsedData.accommodation_address || '',
      parsedData.accommodation_confirmed ? 'confirmed' : 'pending',
      parsedData.accommodation_guests || '',
      parsedData.accommodation_bookingUrl || '',
      parsedData.confirmationNumber || ''
    ].join(',');
    
    csvData.accommodations = `City,Name,Type,Address,Status,Guests,BookingUrl,ConfirmationNumber\n${accommodationRow}`;
  }
  
  // Generate transportation CSV if we have transport info
  if (parsedData.transport_type) {
    const transportRow = [
      parsedData.transport_from || '',
      parsedData.transport_to || '',
      parsedData.transport_date || '',
      parsedData.transport_time || '',
      parsedData.transport_type || '',
      parsedData.transport_provider || '',
      parsedData.transport_status || '',
      parsedData.transport_bookingUrl || '',
      parsedData.confirmationNumber || ''
    ].join(',');
    
    csvData.transportation = `From,To,Date,Time,Type,Provider,Status,BookingUrl,ConfirmationNumber\n${transportRow}`;
  }
  
  return csvData;
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
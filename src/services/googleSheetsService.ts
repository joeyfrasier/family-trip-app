import axios from 'axios';
import type { Destination, FamilyMember, TodoItem } from '../types/trip';

const SHEET_ID = '1k8WOI-n5CbjEaS3lgLZ8RIiAcNSHg4HkfJ_VQ9MNQIY';
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || '';

// Google Sheets API URLs for public sheets
const getSheetUrl = (tabName: string, range: string = '') => {
  if (API_KEY) {
    // Use API key for better reliability and rate limits
    return `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${tabName}${range}?key=${API_KEY}`;
  } else {
    // Fallback to CSV export (no API key required)
    return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${tabName}`;
  }
};

// Parse CSV response
const parseCSV = (csvText: string): string[][] => {
  const lines = csvText.split('\n');
  return lines.map(line => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }).filter(row => row.some(cell => cell.length > 0));
};

// Convert Google Sheets API response to array format
const normalizeResponse = (response: any): string[][] => {
  if (response.values) {
    // API response format
    return response.values;
  } else {
    // CSV response format
    return parseCSV(response);
  }
};

export const fetchDestinations = async (): Promise<Destination[]> => {
  try {
    const url = getSheetUrl('Destinations');
    const response = await axios.get(url);
    const rows = normalizeResponse(response.data);
    
    // Skip header row
    const dataRows = rows.slice(1);
    
    return dataRows.map(row => {
      const [
        id, city, country, countryCode, flag, startDate, endDate,
        accommodationName, accommodationType, accommodationAddress, 
        accommodationConfirmed, accommodationGuests, accommodationBookingUrl,
        transportType, transportFrom, transportTo, transportDate, 
        transportTime, transportProvider, transportStatus, transportBookingUrl,
        keyEvents
      ] = row;

      const destination: Destination = {
        id: id || '',
        city: city || '',
        country: country || '',
        countryCode: countryCode || '',
        flag: flag || '',
        startDate: startDate || '',
        endDate: endDate || '',
        keyEvents: keyEvents ? keyEvents.split(';').map(event => event.trim()) : [],
      };

      // Add accommodation if data exists
      if (accommodationName && accommodationName !== 'To be booked') {
        destination.accommodation = {
          id: `${id}-accommodation`,
          name: accommodationName,
          type: accommodationType as 'airbnb' | 'vrbo' | 'hotel',
          address: accommodationAddress || '',
          checkIn: startDate || '',
          checkOut: endDate || '',
          nights: 0, // Will be calculated in component
          guests: parseInt(accommodationGuests) || 6,
          confirmed: accommodationConfirmed?.toLowerCase() === 'true',
          bookingUrl: accommodationBookingUrl || undefined,
        };
      }

      // Add transportation if data exists
      if (transportType && transportFrom && transportTo) {
        destination.inboundTransport = {
          id: `${id}-transport`,
          type: transportType as 'flight' | 'train' | 'car' | 'ferry',
          from: transportFrom,
          to: transportTo,
          departureDate: transportDate || '',
          departureTime: transportTime || undefined,
          provider: transportProvider || undefined,
          status: (transportStatus as 'confirmed' | 'pending' | 'to-book') || 'pending',
          bookingUrl: transportBookingUrl || undefined,
        };
      }

      return destination;
    }).filter(dest => dest.id); // Filter out empty rows
  } catch (error) {
    console.error('Error fetching destinations from Google Sheets:', error);
    throw error;
  }
};

export const fetchFamilyMembers = async (): Promise<FamilyMember[]> => {
  try {
    const url = getSheetUrl('Family_Members');
    const response = await axios.get(url);
    const rows = normalizeResponse(response.data);
    
    // Skip header row
    const dataRows = rows.slice(1);
    
    return dataRows.map(row => {
      const [id, name, notifications] = row;
      return {
        id: id || '',
        name: name || '',
        notifications: notifications?.toLowerCase() === 'true',
      };
    }).filter(member => member.id);
  } catch (error) {
    console.error('Error fetching family members from Google Sheets:', error);
    throw error;
  }
};

export const fetchTodos = async (): Promise<TodoItem[]> => {
  try {
    const url = getSheetUrl('Todos');
    const response = await axios.get(url);
    const rows = normalizeResponse(response.data);
    
    // Skip header row
    const dataRows = rows.slice(1);
    
    return dataRows.map(row => {
      const [id, category, task, completed, priority, dueDate, assignedTo] = row;
      return {
        id: id || '',
        category: category as 'transportation' | 'lodging' | 'flights' | 'other',
        task: task || '',
        completed: completed?.toLowerCase() === 'true',
        priority: (priority as 'high' | 'medium' | 'low') || 'medium',
        dueDate: dueDate || undefined,
        assignedTo: assignedTo ? assignedTo.split(',').map(name => name.trim()) : undefined,
      };
    }).filter(todo => todo.id);
  } catch (error) {
    console.error('Error fetching todos from Google Sheets:', error);
    throw error;
  }
};
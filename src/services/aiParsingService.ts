import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // Note: For production, API calls should go through a backend
});

export interface ParsedTravelData {
  // Destination info
  city?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  
  // Accommodation info
  accommodation_name?: string;
  accommodation_type?: 'airbnb' | 'vrbo' | 'hotel' | 'other';
  accommodation_address?: string;
  accommodation_confirmed?: boolean;
  accommodation_guests?: number;
  accommodation_bookingUrl?: string;
  
  // Transportation info
  transport_type?: 'flight' | 'train' | 'car' | 'ferry';
  transport_from?: string;
  transport_to?: string;
  transport_date?: string;
  transport_time?: string;
  transport_provider?: string;
  transport_status?: 'confirmed' | 'pending' | 'to-book';
  transport_bookingUrl?: string;
  
  // Additional info
  confirmationNumber?: string;
  notes?: string;
}

const PARSING_PROMPT = `
You are a travel confirmation parser. Extract structured information from travel confirmations, booking emails, or reservation details.

Return ONLY a valid JSON object with the following fields (use null if information is not available):

{
  "city": "destination city name",
  "country": "country name", 
  "startDate": "YYYY-MM-DD format",
  "endDate": "YYYY-MM-DD format",
  "accommodation_name": "hotel/airbnb/property name",
  "accommodation_type": "airbnb|vrbo|hotel|other",
  "accommodation_address": "full address if available",
  "accommodation_confirmed": true/false,
  "accommodation_guests": number,
  "accommodation_bookingUrl": "full booking URL",
  "transport_type": "flight|train|car|ferry",
  "transport_from": "departure location",
  "transport_to": "arrival location", 
  "transport_date": "YYYY-MM-DD",
  "transport_time": "departure time",
  "transport_provider": "airline/company name",
  "transport_status": "confirmed|pending|to-book",
  "transport_bookingUrl": "booking URL",
  "confirmationNumber": "booking reference",
  "notes": "any additional important details"
}

Rules:
- Always use YYYY-MM-DD date format
- Set accommodation_confirmed to true if booking is confirmed
- Infer country from city if not explicitly stated
- Extract any URLs found in the text
- Be conservative - use null if uncertain
- Return valid JSON only, no explanation
`;

export const parseConfirmationText = async (confirmationText: string): Promise<ParsedTravelData> => {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY environment variable.');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-effective model for parsing
      messages: [
        {
          role: "system",
          content: PARSING_PROMPT
        },
        {
          role: "user", 
          content: `Parse this travel confirmation:\n\n${confirmationText}`
        }
      ],
      temperature: 0.1, // Low temperature for consistent parsing
      max_tokens: 1000,
    });

    const parsedContent = response.choices[0]?.message?.content;
    if (!parsedContent) {
      throw new Error('No response from AI');
    }

    // Clean up the response and parse JSON
    const cleanedContent = parsedContent.trim();
    const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    
    // Validate and clean the data
    const cleanedData: ParsedTravelData = {};
    
    // Copy over non-null values
    Object.keys(parsedData).forEach(key => {
      if (parsedData[key] !== null && parsedData[key] !== undefined && parsedData[key] !== '') {
        cleanedData[key as keyof ParsedTravelData] = parsedData[key];
      }
    });

    return cleanedData;
  } catch (error) {
    console.error('Error parsing confirmation text:', error);
    throw new Error(`Failed to parse confirmation: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
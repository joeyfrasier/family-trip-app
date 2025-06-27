import { useState, useEffect } from 'react';
import type { Trip } from '../types/trip';
import { fetchDestinations, fetchFamilyMembers, fetchTodos } from '../services/googleSheetsService';
import { tripData as fallbackData } from '../data/tripData';

interface UseTripDataReturn {
  tripData: Trip;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTripData = (): UseTripDataReturn => {
  const [tripData, setTripData] = useState<Trip>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [destinations, familyMembers, todos] = await Promise.all([
        fetchDestinations(),
        fetchFamilyMembers(),
        fetchTodos(),
      ]);

      // Create updated trip data
      const updatedTripData: Trip = {
        ...fallbackData,
        destinations,
        familyMembers,
        todos,
        lastUpdated: new Date().toISOString(),
      };

      setTripData(updatedTripData);
    } catch (err) {
      console.error('Failed to fetch trip data from Google Sheets:', err);
      setError('Failed to load latest trip data. Showing cached version.');
      // Keep using fallback data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    tripData,
    loading,
    error,
    refetch: fetchData,
  };
};
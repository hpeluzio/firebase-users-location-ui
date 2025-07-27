import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ZIP_REGEX = /^\d{5}(-\d{4})?$/;
const API_BASE_URL = 'http://localhost:3000';

export function useZipValidation(zip: string) {
  const [zipError, setZipError] = useState<string | null>(null);
  const [isZipValid, setIsZipValid] = useState<boolean | null>(null);
  const [isZipChecking, setIsZipChecking] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!zip || !ZIP_REGEX.test(zip)) {
      setIsZipValid(null);
      setZipError(null);
      setIsZipChecking(false);
      return;
    }
    setIsZipChecking(true);
    setZipError(null);
    setIsZipValid(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/zipcodes/validate/${zip}`);
        if (res.data && res.data.valid) {
          setIsZipValid(true);
          setZipError(null);
        } else {
          setIsZipValid(false);
          setZipError('Zip code not found. Please enter a valid US zip code.');
        }
      } catch {
        setIsZipValid(false);
        setZipError('Zip code not found. Please enter a valid US zip code.');
      } finally {
        setIsZipChecking(false);
      }
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [zip]);

  return {
    zipError,
    isZipValid,
    isZipChecking,
  };
} 
import { useState, useEffect } from 'react';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/user';
import { useZipValidation } from './useZipValidation';

const ZIP_REGEX = /^\d{5}(-\d{4})?$/;

export function useUserForm(initialUser?: User, onSubmit?: (data: CreateUserRequest | UpdateUserRequest) => void) {
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: '',
    zipCode: '',
  });
  const [nameError, setNameError] = useState<string | null>(null);
  const {
    zip,
    setZip,
    zipError,
    isZipValid,
    isZipChecking,
  } = useZipValidation(initialUser?.zipCode || '');

  useEffect(() => {
    if (initialUser) {
      setFormData({
        name: initialUser.name,
        zipCode: initialUser.zipCode,
      });
      setZip(initialUser.zipCode);
    }
  }, [initialUser, setZip]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, zipCode: zip }));
  }, [zip]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    if (typeof e === 'string') {
      setZip(e);
    } else {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      if (name === 'name') {
        setNameError(value.trim() ? null : 'Name is required');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setNameError('Name is required');
      return;
    }
    if (!ZIP_REGEX.test(formData.zipCode) || isZipValid === false || isZipChecking) {
      return;
    }
    setNameError(null);
    onSubmit?.(formData);
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    nameError,
    zipError,
    isZipValid,
    isZipChecking,
  };
} 
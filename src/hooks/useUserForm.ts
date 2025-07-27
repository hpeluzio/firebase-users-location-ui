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
  const { zipError, isZipValid, isZipChecking } = useZipValidation(formData.zipCode);

  useEffect(() => {
    if (initialUser) {
      setFormData({
        name: initialUser.name,
        zipCode: initialUser.zipCode,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    if (typeof e === 'string') {
      setFormData(prev => prev.zipCode !== e ? { ...prev, zipCode: e } : prev);
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
import { useState, useEffect } from 'react';
import { IMaskInput } from 'react-imask';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/user';

interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ZIP_REGEX = /^\d{5}(-\d{4})?$/;

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: '',
    zipCode: '',
  });
  const [zipError, setZipError] = useState<string | null>(null);

  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        zipCode: user.zipCode,
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ZIP_REGEX.test(formData.zipCode)) {
      setZipError('Zip code must be in valid US format (e.g., 12345 or 12345-6789)');
      return;
    }
    setZipError(null);
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    if (typeof e === 'string') {
      setFormData(prev => ({ ...prev, zipCode: e }));
      if (e === '' || ZIP_REGEX.test(e)) {
        setZipError(null);
      } else {
        setZipError('Zip code must be in valid US format (e.g., 12345 or 12345-6789)');
      }
    } else {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // react-imask: mask for 5 or 9 digit zip codes (with optional dash)
  // Mask explanation: 00000[\-0000] means 5 digits, optionally dash and 4 digits
  const zipMask = '00000[-0000]';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {isEditing ? 'Edit User' : 'Create New User'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter user name"
          />
        </div>

        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
            Zip Code
          </label>
          <IMaskInput
            mask={zipMask}
            value={formData.zipCode}
            onAccept={(value) => handleChange(value)}
            id="zipCode"
            name="zipCode"
            required
            unmask={false}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${zipError ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter zip code"
            autoComplete="off"
          />
          {zipError && (
            <p className="text-red-600 text-xs mt-1">{zipError}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : (isEditing ? 'Update User' : 'Create User')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm; 
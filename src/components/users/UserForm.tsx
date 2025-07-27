import { IMaskInput } from 'react-imask';
import type { User, CreateUserRequest, UpdateUserRequest } from '../../types/user';
import { useUserForm } from '../../hooks/useUserForm';
import { PlusIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel, isLoading = false }) => {
  const {
    formData,
    handleChange,
    handleSubmit,
    nameError,
    zipError,
    isZipChecking,
  } = useUserForm(user, onSubmit);

  const isEditing = !!user;
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${nameError ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter user name"
          />
          {nameError && <p className="text-red-600 text-xs mt-1">{nameError}</p>}
        </div>
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
            Zip Code
          </label>
          <IMaskInput
            mask={zipMask}
            value={formData.zipCode}
            onAccept={(value: string) => handleChange(value)}
            id="zipCode"
            name="zipCode"
            required
            unmask={false}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${zipError ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter zip code"
            autoComplete="off"
          />
          {isZipChecking && (
            <p className="text-blue-600 text-xs mt-1">Validating zip code...</p>
          )}
          {zipError && !isZipChecking && (
            <p className="text-red-600 text-xs mt-1">{zipError}</p>
          )}
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading || isZipChecking}
            className="flex-1 flex items-center justify-center gap-2 border border-blue-600 text-blue-600 bg-white py-2 px-4 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? (
              <><Spinner /> {isEditing ? 'Updating...' : 'Creating...'}</>
            ) : isEditing ? (
              <><PencilSquareIcon className="h-5 w-5" aria-hidden="true" /> Update User</>
            ) : (
              <><PlusIcon className="h-5 w-5" aria-hidden="true" /> Create User</>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-400 text-gray-700 bg-white py-2 px-4 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm; 
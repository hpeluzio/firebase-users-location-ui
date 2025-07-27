import { useState, useEffect } from 'react';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/user';
import userService from '../services/userService';
import UserForm from './UserForm';
import UserList from './UserList';

const UserCRUD: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [error, setError] = useState<string | null>(null);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users. Please check if the API server is running.');
      console.error('Error loading users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (userData: CreateUserRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const newUser = await userService.createUser(userData);
      setUsers(prev => [...prev, newUser]);
      setIsFormVisible(false);
    } catch (err) {
      setError('Failed to create user. Please try again.');
      console.error('Error creating user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (userData: UpdateUserRequest) => {
    if (!editingUser?.id) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateUser(editingUser.id, userData);
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id ? updatedUser : user
      ));
      setEditingUser(undefined);
      setIsFormVisible(false);
    } catch (err) {
      setError('Failed to update user. Please try again.');
      console.error('Error updating user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    setIsLoading(true);
    setError(null);
    try {
      await userService.deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to delete user. Please try again.');
      console.error('Error deleting user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormVisible(true);
  };

  const handleCancelForm = () => {
    setEditingUser(undefined);
    setIsFormVisible(false);
  };

  const handleSubmitForm = (data: CreateUserRequest | UpdateUserRequest) => {
    if (editingUser) {
      handleUpdateUser(data as UpdateUserRequest);
    } else {
      handleCreateUser(data as CreateUserRequest);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage your users with full CRUD operations</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* User List */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Users</h2>
            <button
              onClick={() => setIsFormVisible(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Add New User
            </button>
          </div>
          
          <UserList
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            isLoading={isLoading}
          />
        </div>

        {/* User Form */}
        {isFormVisible && (
          <div className="lg:w-96">
            <UserForm
              user={editingUser}
              onSubmit={handleSubmitForm}
              onCancel={handleCancelForm}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">API Endpoints</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>GET</strong> /users - Get all users</p>
          <p><strong>GET</strong> /users/:id - Get specific user</p>
          <p><strong>POST</strong> /users - Create new user</p>
          <p><strong>PATCH</strong> /users/:id - Update user</p>
          <p><strong>DELETE</strong> /users/:id - Delete user</p>
        </div>
      </div>
    </div>
  );
};

export default UserCRUD; 
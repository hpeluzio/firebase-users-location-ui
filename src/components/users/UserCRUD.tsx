import { useState, useEffect, Fragment } from 'react';
import type { User, CreateUserRequest, UpdateUserRequest } from '../../types/user';
import UserList from './UserList';
import UserForm from './UserForm';
import { useUsers } from '../../hooks/useUsers';
import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const UserCRUD: React.FC = () => {
  const { users, loading, error, fetchUsers, createUser, updateUser, deleteUser } = useUsers();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Calculate paginated users
  const total = users.length;
  const totalPages = Math.ceil(total / pageSize);
  const paginatedUsers = users.slice((page - 1) * pageSize, page * pageSize);

  // Reset page if pageSize changes or users change
  useEffect(() => {
    setPage(1);
  }, [pageSize, total]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormVisible(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    await deleteUser(userId);
  };

  const handleCreateClick = () => {
    setEditingUser(undefined);
    setIsFormVisible(true);
  };

  const handleFormCancel = () => {
    setEditingUser(undefined);
    setIsFormVisible(false);
  };

  const handleFormSubmit = async (data: CreateUserRequest | UpdateUserRequest) => {
    setIsSaving(true);
    try {
      if (editingUser && editingUser.id) {
        await updateUser(editingUser.id, data as UpdateUserRequest);
      } else {
        await createUser(data as CreateUserRequest);
      }
      setIsFormVisible(false);
      setEditingUser(undefined);
    } finally {
      setIsSaving(false);
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
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Users</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
            Add New User
          </button>
          <label htmlFor="pageSize" className="text-sm text-gray-700 ml-4">Rows per page:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <UserList
            users={paginatedUsers}
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={handlePageChange}
            isLoading={loading}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        </div>
      </div>
      {/* Drawer Modal for UserForm */}
      <Transition.Root show={isFormVisible} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleFormCancel}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-200"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="w-screen max-w-md">
                    <div className="h-full flex flex-col bg-white shadow-xl">
                      <div className="flex-1 overflow-y-auto p-6">
                        <UserForm
                          user={editingUser}
                          onSubmit={handleFormSubmit}
                          onCancel={handleFormCancel}
                          isLoading={isSaving}
                        />
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default UserCRUD; 
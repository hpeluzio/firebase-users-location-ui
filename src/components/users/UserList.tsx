import type { User } from '../../types/user';
import { PencilSquareIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline';
import { useState, useMemo, useEffect } from 'react';

interface UserListProps {
  users: User[];
  isLoading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const UserList: React.FC<UserListProps> = ({
  users,
  isLoading = false,
  onEdit,
  onDelete,
}) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const filteredUsers = useMemo(() => {
    if (!debouncedSearch) return users;
    const q = debouncedSearch.toLowerCase();
    return users.filter((user) =>
      user.name.toLowerCase().includes(q) ||
      user.zipCode.toLowerCase().includes(q) ||
      (user.latitude !== undefined && String(user.latitude).includes(q)) ||
      (user.longitude !== undefined && String(user.longitude).includes(q)) ||
      (user.timezone ?? '').toLowerCase().includes(q)
    );
  }, [users, debouncedSearch]);

  // Pagination
  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / pageSize);
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice((page - 1) * pageSize, page * pageSize);
  }, [filteredUsers, page, pageSize]);

  // Reset page if pageSize or filtered users change
  useEffect(() => {
    setPage(1);
  }, [pageSize, total]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500 text-lg">No users found</p>
        <p className="text-gray-400 text-sm mt-2">Create your first user to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h2 className="text-xl font-semibold text-gray-900">Users ({filteredUsers.length})</h2>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border-2 border-blue-300 rounded-lg px-2 py-1 text-sm w-full max-w-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          placeholder="Search users by any field..."
        />
      </div>
      <div className="px-6 py-2 flex items-center gap-2 justify-end">
        <label htmlFor="pageSize" className="text-sm text-gray-700">Rows per page:</label>
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
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zip Code</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latitude</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Longitude</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timezone</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                <UserIcon className="h-6 w-6 text-blue-400 flex-shrink-0" aria-hidden="true" />
                <span className="text-lg font-medium text-gray-900">{user.name}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.zipCode}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.latitude ?? '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.longitude ?? '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.timezone ?? '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onEdit(user)}
                    className="flex items-center gap-1 px-3 py-1 text-sm border border-blue-600 text-blue-600 bg-white rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                  >
                    <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    onClick={() => user.id && onDelete(user.id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm border border-red-600 text-red-600 bg-white rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
                  >
                    <TrashIcon className="h-5 w-5" aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 py-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-2 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded ${p === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} font-medium`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-2 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList; 
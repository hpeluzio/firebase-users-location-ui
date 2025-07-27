import type { User } from '../../types/user';
import { PencilSquareIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline';

interface UserListProps {
  users: User[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({
  users,
  page,
  pageSize,
  total,
  onPageChange,
  isLoading = false,
  onEdit,
  onDelete,
}) => {
  const totalPages = Math.ceil(total / pageSize);

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
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Users ({total})</h2>
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
          {users.map((user) => (
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
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-2 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 rounded ${p === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} font-medium`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
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
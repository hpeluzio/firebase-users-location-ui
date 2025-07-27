import axios from 'axios';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/user';

const API_BASE_URL = 'http://localhost:3000';

const userService = {
  // Get all users
  async getAllUsers(): Promise<User[]> {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  },

  // Get specific user
  async getUserById(id: string): Promise<User> {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`);
    return response.data;
  },

  // Create user
  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await axios.post(`${API_BASE_URL}/users`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Update user
  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    const response = await axios.patch(`${API_BASE_URL}/users/${id}`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Delete user
  async deleteUser(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/users/${id}`);
  },
};

export default userService; 
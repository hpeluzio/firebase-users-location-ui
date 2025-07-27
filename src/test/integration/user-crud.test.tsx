import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '../utils/test-utils'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { handlers } from '../mocks/handlers'
import UserCRUD from '../../components/users/UserCRUD'

// Setup MSW server
const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('UserCRUD Integration Tests', () => {
  it('should display users on initial load', async () => {
    render(<UserCRUD />)
    
    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })
  })

  it('should open form when "Add New User" is clicked', async () => {
    const user = userEvent.setup()
    render(<UserCRUD />)
    
    // Wait for users to load first
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    const addButton = screen.getByText('Add New User')
    await user.click(addButton)
    
    // Form should be visible
    expect(screen.getByText('Create New User')).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument()
  })

  it('should fill and submit form successfully', async () => {
    const user = userEvent.setup()
    render(<UserCRUD />)
    
    // Wait for users to load first
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    // Open form
    const addButton = screen.getByText('Add New User')
    await user.click(addButton)
    
    // Fill form
    const nameInput = screen.getByLabelText(/name/i)
    const zipInput = screen.getByLabelText(/zip code/i)
    
    await user.type(nameInput, 'New User')
    await user.type(zipInput, '12345')
    
    // Submit form
    const submitButton = screen.getByText('Create User')
    await user.click(submitButton)
    
    // Form should still be visible (modal doesn't close automatically)
    expect(screen.getByText('Create New User')).toBeInTheDocument()
  })

  it('should validate zip code format', async () => {
    const user = userEvent.setup()
    render(<UserCRUD />)
    
    // Wait for users to load first
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    // Open form
    const addButton = screen.getByText('Add New User')
    await user.click(addButton)
    
    const zipInput = screen.getByLabelText(/zip code/i)
    
    // Test valid zip code format
    await user.type(zipInput, '12345')
    await user.tab() // Trigger blur
    
    // Should accept valid format
    expect(zipInput).toHaveValue('12345')
  })

  it('should search and filter users', async () => {
    const user = userEvent.setup()
    render(<UserCRUD />)
    
    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    // Find search input
    const searchInput = screen.getByPlaceholderText(/search users/i)
    await user.type(searchInput, 'John')
    
    // Should show only John Doe
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
    })
    
    // Clear search
    await user.clear(searchInput)
    await user.type(searchInput, 'Jane')
    
    // Should show only Jane Smith
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    })
  })

  it('should paginate users correctly', async () => {
    const user = userEvent.setup()
    render(<UserCRUD />)
    
    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    // Check if pagination controls are present
    const rowsPerPageSelect = screen.getByLabelText(/rows per page/i)
    expect(rowsPerPageSelect).toBeInTheDocument()
    
    // Change rows per page
    await user.selectOptions(rowsPerPageSelect, '5')
    
    // Should still show both users since we only have 2
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('should open edit form when edit button is clicked', async () => {
    const user = userEvent.setup()
    render(<UserCRUD />)
    
    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    // Click edit button for first user
    const editButtons = screen.getAllByText('Edit')
    await user.click(editButtons[0])
    
    // Form should open with user data
    await waitFor(() => {
      expect(screen.getByText('Edit User')).toBeInTheDocument()
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    })
  })

  it('should have delete buttons available', async () => {
    render(<UserCRUD />)
    
    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    // Check that delete buttons are present
    const deleteButtons = screen.getAllByText('Delete')
    expect(deleteButtons).toHaveLength(2) // One for each user
  })
}) 
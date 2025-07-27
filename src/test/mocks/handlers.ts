import { http, HttpResponse } from 'msw'

const API_BASE = 'http://localhost:3000'

interface UserRequest {
  name: string
  zipCode: string
}

export const handlers = [
  // Get all users
  http.get(`${API_BASE}/users`, () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'John Doe',
        zipCode: '12345',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'America/New_York'
      },
      {
        id: '2',
        name: 'Jane Smith',
        zipCode: '54321-1234',
        latitude: 34.0522,
        longitude: -118.2437,
        timezone: 'America/Los_Angeles'
      }
    ])
  }),

  // Create user
  http.post(`${API_BASE}/users`, async ({ request }) => {
    const body = await request.json() as UserRequest
    return HttpResponse.json({
      id: '3',
      ...body,
      latitude: 40.7128,
      longitude: -74.0060,
      timezone: 'America/New_York'
    })
  }),

  // Update user
  http.patch(`${API_BASE}/users/:id`, async ({ request }) => {
    const body = await request.json() as Partial<UserRequest>
    return HttpResponse.json({
      id: '1',
      name: 'John Doe Updated',
      zipCode: '12345',
      ...body,
      latitude: 40.7128,
      longitude: -74.0060,
      timezone: 'America/New_York'
    })
  }),

  // Delete user
  http.delete(`${API_BASE}/users/:id`, () => {
    return HttpResponse.json({ message: 'User deleted successfully' })
  }),

  // Zip code validation
  http.get(`${API_BASE}/zipcodes/validate/:zipCode`, ({ params }) => {
    const { zipCode } = params
    const validZipCodes = ['12345', '54321-1234', '67890']
    
    if (validZipCodes.includes(zipCode as string)) {
      return HttpResponse.json({ valid: true })
    } else {
      return HttpResponse.json(
        { 
          statusCode: 400, 
          message: `Zip code "${zipCode}" not found. Please enter a valid US zip code.` 
        },
        { status: 400 }
      )
    }
  })
] 
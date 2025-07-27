import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'

// Custom render function that includes any providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options })

// Export specific testing utilities
export { screen, waitFor, fireEvent }
export type { RenderOptions }

// Override render method
export { customRender as render } 
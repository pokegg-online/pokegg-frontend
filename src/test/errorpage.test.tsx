import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ErrorPage } from '../components/ErrorPage'

test('navigates to home on button click', async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <ErrorPage code="404" />
      </MemoryRouter>,
    )
  })

  const button = screen.getByRole('button', { name: /홈으로 돌아가기/i })
  await act(async () => {
    fireEvent.click(button)
  })

  expect(window.location.pathname).toBe('/')
})

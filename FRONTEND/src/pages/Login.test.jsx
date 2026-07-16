import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { AuthContext } from '../context/AuthContext';

const loginMock = vi.fn();

vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useAuthContext: () => ({
      login: loginMock,
      authLoading: false,
    }),
  };
});

describe('Login page', () => {
  beforeEach(() => {
    loginMock.mockReset();
  });

  it('shows inline validation and enables submission only when fields are valid', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton).toBeDisabled();

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'not-an-email');
    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();

    await user.clear(emailInput);
    await user.type(emailInput, 'name@example.com');
    expect(screen.queryByText(/please enter a valid email/i)).not.toBeInTheDocument();

    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, 'abc');
    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();

    await user.clear(passwordInput);
    await user.type(passwordInput, 'StrongPassword1');
    expect(submitButton).toBeEnabled();
  });
});

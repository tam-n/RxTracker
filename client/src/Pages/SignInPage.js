import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const body = {
        username,
        password,
      };

      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      };
      const res = await fetch('/api/auth/sign-in', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const { token } = await res.json();

      sessionStorage.setItem('token', token);
      navigate('/');
    } catch (err) {
      alert(`Error signing in: ${err}`);
    }
  }

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col text-rust-gray">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center">Sign In</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />

            <input
              type="password"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            <button
              type="submit"
              className="w-full text-center py-3 rounded bg-rust-gray text-white hover:bg-green-dark focus:outline-none my-1">
              Login
            </button>
          </form>
        </div>

        <div className="text-grey-dark mt-6">
          New user?
          <a
            className="no-underline border-b border-blue text-blue"
            href="/signup">
            Create an account
          </a>
          .
        </div>
      </div>
    </div>
  );
}

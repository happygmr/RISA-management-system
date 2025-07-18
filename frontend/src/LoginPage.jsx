import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth';
import apiService from './services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await apiService.login(email, password);
      
      if (data.success) {
        // Set the token in the API service
        apiService.setToken(data.data.token);
        // Login with user data and token
        login(data.data.user, data.data.token);
        // Redirect based on role
        const role = data.data.user.role;
        if (role === 'admin') {
          navigate('/dashboard/admin');
        } else if (role === 'teacher') {
          navigate('/dashboard/teacher');
        } else {
          setError('Unauthorized role');
          return;
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input type="email" className="w-full border px-3 py-2 rounded input-mobile" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Password</label>
          <input type="password" className="w-full border px-3 py-2 rounded input-mobile" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 button-touch" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
} 
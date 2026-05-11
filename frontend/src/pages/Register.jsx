import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center auth-container">
      <div className="auth-card rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 text-sm mt-2">Get started with TaskFlow</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="input-label">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="input-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Min 6 characters"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="input-label">Account Type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-field"
            >
              <option value="member">Regular Member</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-600 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../ui/Input';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/app');
    } catch (err) {
      toast.error(
        err.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-xl font-heading font-semibold text-gexa-text mb-1">
          Welcome back
        </h2>
        <p className="text-sm text-gexa-muted">
          Sign in to your GexaCanvas account
        </p>
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />

      <Button
        type="submit"
        loading={loading}
        className="w-full"
        size="lg"
      >
        <LogIn className="w-4 h-4" />
        Sign In
      </Button>

      <p className="text-center text-sm text-gexa-muted">
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="text-gexa-purple hover:text-gexa-purple-hover transition-colors font-medium"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}

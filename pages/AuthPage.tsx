import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LayoutDashboard } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email);
      } else {
        if (!name) throw new Error("Name is required");
        await signUp(name, email);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg shadow-indigo-200">
            L
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome to Lumina</h1>
        <p className="text-slate-500 mt-2">Build habits, track projects, achieve more.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 w-full max-w-md border border-slate-100">
        <div className="flex gap-4 mb-6 p-1 bg-slate-50 rounded-xl">
            <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Sign In
            </button>
            <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Create Account
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
                <Input 
                    label="Full Name" 
                    placeholder="Jane Doe" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
            )}
            <Input 
                label="Email Address" 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            
            {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
            
            <Button className="w-full justify-center" size="lg" isLoading={loading}>
                {isLogin ? 'Sign In' : 'Get Started'}
            </Button>
        </form>
        
        <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
                By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
      </div>
    </div>
  );
};

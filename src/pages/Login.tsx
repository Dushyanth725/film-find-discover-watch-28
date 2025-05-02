
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!username || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      setLoading(false);
      return;
    }

    // In a real app, this would make an API request to authenticate or register user
    setTimeout(() => {
      if (isLogin) {
        // Simple login simulation (in real app, this would be an API call)
        const storedUser = localStorage.getItem(username);
        if (storedUser && JSON.parse(storedUser).password === password) {
          localStorage.setItem('username', username);
          localStorage.setItem('isLoggedIn', 'true');
          navigate('/dashboard');
        } else {
          toast({
            title: 'Login Failed',
            description: 'Invalid username or password',
            variant: 'destructive'
          });
        }
      } else {
        // Simple registration simulation
        const storedUser = localStorage.getItem(username);
        if (storedUser) {
          toast({
            title: 'Registration Failed',
            description: 'Username already exists',
            variant: 'destructive'
          });
        } else {
          // Store user info
          localStorage.setItem(username, JSON.stringify({
            username,
            password,
            liked: [],
            watched: [],
            watchlist: []
          }));
          
          localStorage.setItem('username', username);
          localStorage.setItem('isLoggedIn', 'true');
          
          toast({
            title: 'Registration Successful',
            description: 'Your account has been created'
          });
          
          navigate('/dashboard');
        }
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl text-center text-cinema-red my-8">KNOW YOUR FILMS</h1>
        <div className="max-w-md mx-auto bg-card rounded-lg border border-border p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? 'Login' : 'Create Account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full btn-cinema" 
              disabled={loading}
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-cinema-red hover:underline text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

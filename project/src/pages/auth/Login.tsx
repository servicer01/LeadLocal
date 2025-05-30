import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Paper,
  Grid,
  Alert,
} from '@mui/material';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading, error, clearError } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await signIn(email, password);
      // Redirect happens automatically in ProtectedRoute when user is set
    } catch (err) {
      // Error is handled in AuthContext
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://images.pexels.com/photos/3184419/pexels-photo-3184419.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: 'white',
            padding: 4,
            zIndex: 1,
          }}
        >
          <Typography
            component="h1"
            variant="h3"
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            GeoQualified Pro
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Personalized Outreach Engine
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 600 }}>
            Transform your lead management process with AI-powered personalization, advanced analytics, and comprehensive campaign management tools.
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={0} square>
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 3, sm: 4, md: 8 },
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              maxWidth: 400,
              width: '100%',
            }}
          >
            <Typography component="h1" variant="h5" fontWeight={600} sx={{ mb: 1 }}>
              Welcome back
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Sign in to access your account
            </Typography>

            {error && (
              <Alert 
                severity="error" 
                onClose={clearError}
                sx={{ width: '100%', mb: 3 }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={20} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ py: 1.5, mb: 2 }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  mt: 2,
                }}
              >
                <Link href="#" variant="body2" color="primary">
                  Forgot password?
                </Link>
                <Link component={RouterLink} to="/register" variant="body2" color="primary">
                  Don't have an account? Sign Up
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
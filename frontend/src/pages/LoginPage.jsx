  import React, { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { useDispatch } from 'react-redux';
  import axios from 'axios';
  import inventoryImage from "../assets/inventory_bg.avif";
  import { 
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    TextField,
    Button,
    Container,
    Grid,
    InputAdornment,
    Alert,
    CircularProgress,
  } from '@mui/material';
  import { Link } from 'react-router-dom';
  import { styled } from '@mui/material/styles';
  import EmailIcon from '@mui/icons-material/Email';
  import LockIcon from '@mui/icons-material/Lock';
  import { GoogleLogin } from '@react-oauth/google';
  import { loginApi, loginWithGoogleApi } from '../utils/routes';
  import { setCurrentUser } from '../slice/selectionSlice';

  const DividerWithText = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    '&::before, &::after': {
      content: '""',
      flex: 1,
      borderBottom: `1px solid ${theme.palette.grey[400]}`,
    },
    '& span': {
      padding: theme.spacing(0, 2),
      color: theme.palette.grey[600],
      textTransform: 'lowercase',
    },
  }));
  const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 1000,
    margin: 'auto',
    display: 'flex',
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[10],
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  }));

  const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        const response = await axios.post(loginApi, formData, {
          withCredentials: true,
        });
        dispatch(setCurrentUser(response.data.user));
        setLoading(false);
        navigate('/home');
      } catch (err) {
        setLoading(false);
        setError(err.response?.data?.message || 'An error occurred');
      }
    };

    const handleGoogleLogin = async (response) => {
      try {
        const googleResponse = await axios.post(
          loginWithGoogleApi,
          { token: response.credential },
          { withCredentials: true }
        );
        dispatch(setCurrentUser(googleResponse.data.user));
        navigate('/home');
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred during Google login');
      }
    };

    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'grey.100',
          py: 4,
        }}
      >
        <Container>
          <StyledCard>
            <CardMedia
              component="img"
              sx={{
                width: { md: '50%' },
                objectFit: 'cover',
              }}
              image={inventoryImage}
              alt="Inventory background"
            />
            <CardContent
              sx={{
                flex: 1,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="grey.900">
                Login
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: 'grey.800' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'grey.300',
                          },
                          '&:hover fieldset': {
                            borderColor: 'grey.400',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'grey.700',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: 'grey.700',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: 'grey.800' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'grey.300',
                          },
                          '&:hover fieldset': {
                            borderColor: 'grey.400',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'grey.700',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: 'grey.700',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ textAlign: 'right' }}>
                    <Link
                    to={'/forgot-password'}
                      component="button"
                      variant="body2"
                      sx={{ 
                        textDecoration: 'none',
                        color: 'grey.700',
                        '&:hover': {
                          color: 'grey.900',
                        },
                      }}
                    >
                      Forgot Password?
                    </Link>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={loading}
                      sx={{ 
                        py: 1.5,
                        bgcolor: 'grey.900',
                        '&:hover': {
                          bgcolor: 'grey.800',
                        },
                      }}
                    >
                      {loading ? <CircularProgress size={24} sx={{ color: 'grey.800' }} /> : 'Login'}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                  <DividerWithText>
                    <span>or</span>
                  </DividerWithText>
                </Grid>
                  <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <Box sx={{ mt: 2 }}>
                      <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => setError('Google login failed')}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </StyledCard>
        </Container>
      </Box>
    );
  };

  export default LoginPage;
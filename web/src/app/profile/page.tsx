'use client';

// Global imports
import { Box, Typography, Grid, Card, CardContent, CardMedia, TextField, Button, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';

// Scoped imports
import Layout from '@/layout';

// Define the type for the user profile
interface Profile {
  name: string;
  email: string;
  profilePicture: string;
}

// Simulating a fake API call to fetch user data
const fetchUserProfile = (): Promise<Profile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'John Doe',
        email: 'john.doe@example.com',
        profilePicture: '/assets/images/user_default.png',
      });
    }, 1000);
  });
};

// Simulating a fake API call to update user data
const updateUserProfile = (updatedProfile: Profile): Promise<Profile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(updatedProfile);
    }, 1000);
  });
};

// Simulating a fake API call to delete the account
const deleteUserAccount = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

export default function ProfilePage() {
  const [user, setUser] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState<Profile>({ name: '', email: '', profilePicture: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUserProfile().then((profileData) => {
      setUser(profileData);
      setFormValues(profileData);
      setLoading(false);
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setSaving(true);
    updateUserProfile(formValues).then((updatedProfile) => {
      setUser(updatedProfile);
      setIsEditing(false);
      setSaving(false);
    });
  };

  const handleDeleteClick = () => {
    setDeleting(true);
    deleteUserAccount().then(() => {
      // Simulating account deletion by clearing user data
      setUser(null);
      setDeleting(false);
    });
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Typography variant="h6">Account deleted. Goodbye!</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          {/* Profile Header */}
          <Box sx={{ padding: 2 }}>
            <Typography variant="h4" align="center">
              Your Profile
            </Typography>
          </Box>

          {/* Profile Card */}
          <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
            <CardMedia
              component="img"
              sx={{ width: 150, height: 150, borderRadius: '50%' }}
              image={user?.profilePicture}
              alt={user?.name}
            />
            <CardContent>
              {!isEditing ? (
                <>
                  <Typography variant="h5">{user?.name}</Typography>
                  <Typography variant="subtitle1">{user?.email}</Typography>
                  <Button variant="contained" onClick={handleEditClick} sx={{ mt: 2 }}>
                    Edit Profile
                  </Button>
                  <Button variant="outlined" color="error" onClick={handleDeleteClick} sx={{ mt: 2, ml: 2 }} disabled={deleting}>
                    {deleting ? <CircularProgress size={24} /> : 'Delete Account'}
                  </Button>
                </>
              ) : (
                <Box component="form" noValidate autoComplete="off">
                  <TextField fullWidth margin="normal" label="Name" name="name" value={formValues.name} onChange={handleInputChange} />
                  <TextField fullWidth margin="normal" label="Email" name="email" value={formValues.email} onChange={handleInputChange} />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Profile Picture URL"
                    name="profilePicture"
                    value={formValues.profilePicture}
                    onChange={handleInputChange}
                  />
                  <Button variant="contained" sx={{ mt: 2 }} onClick={handleSaveClick} disabled={saving}>
                    {saving ? <CircularProgress size={24} /> : 'Save'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

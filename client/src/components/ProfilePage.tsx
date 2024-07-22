import React from 'react';
import { AppBar, Toolbar, Typography, Container, Avatar, Grid, Paper, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { IUser } from '../models/IUser';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme | any) => ({
  appBar: {
    marginBottom: theme.spacing(4),
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    margin: 'auto',
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: 'center',
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

interface ProfilePageProps {
  user: IUser;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout();
    navigate('/');
  };

  return (
    <>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Welcome, {user.name}
          </Typography>
          <Button color="inherit" startIcon={<ExitToAppIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.paper}>
              <Avatar className={classes.avatar}>
                <AccountCircleIcon style={{ fontSize: 60 }} />
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {user.name}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {user.email}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {user.isActivated ? 'Account has been activated by email' : 'Activate your account!!!!'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => alert('Edit Profile clicked')}
              >
                Edit Profile
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ProfilePage;

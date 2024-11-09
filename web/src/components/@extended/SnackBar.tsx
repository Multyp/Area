'use client';

// Global imports
import { SyntheticEvent } from 'react';
import { Alert, Button, Fade, Grow, Slide, SlideProps, IconButton, Snackbar } from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';

// Scoped imports
import { dispatch, useSelector } from '@/store';
import { closeSnackbar } from '@/store/reducers/snackbar';
import { KeyedObject } from '@/types/root';

function TransitionSlideLeft(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

function TransitionSlideUp(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

function TransitionSlideRight(props: SlideProps) {
  return <Slide {...props} direction="right" />;
}

function TransitionSlideDown(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

function GrowTransition(props: SlideProps) {
  return <Grow {...props} />;
}

const animation: KeyedObject = {
  SlideLeft: TransitionSlideLeft,
  SlideUp: TransitionSlideUp,
  SlideRight: TransitionSlideRight,
  SlideDown: TransitionSlideDown,
  Grow: GrowTransition,
  Fade,
};

const SnackbarExtended = () => {
  const snackbar = useSelector((state) => state.snackbar);
  const { actionButton, anchorOrigin, alert, close, message, open, transition, variant } = snackbar;

  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeSnackbar());
  };

  return (
    <>
      {variant === 'default' && (
        <Snackbar
          anchorOrigin={anchorOrigin}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={message}
          TransitionComponent={animation[transition]}
          action={
            <>
              <Button color="secondary" size="small" onClick={handleClose}>
                UNDO
              </Button>
              <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose} sx={{ mt: 0.25 }}>
                <CloseOutlined />
              </IconButton>
            </>
          }
          sx={{
            ...(alert.variant === 'outlined' && {
              bgcolor: 'grey.0',
            }),
          }}
        />
      )}
      {variant === 'alert' && (
        <Snackbar
          TransitionComponent={animation[transition]}
          anchorOrigin={anchorOrigin}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            variant={alert.variant}
            color={alert.color}
            action={
              <>
                {actionButton !== false && (
                  <Button color={alert.color} size="small" onClick={handleClose}>
                    UNDO
                  </Button>
                )}
                {close !== false && (
                  <IconButton sx={{ mt: 0.25 }} size="small" aria-label="close" color={alert.color} onClick={handleClose}>
                    <CloseOutlined />
                  </IconButton>
                )}
              </>
            }
            sx={{
              ...(alert.variant === 'outlined' && {
                bgcolor: 'grey.0',
              }),
            }}
          >
            {message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default SnackbarExtended;

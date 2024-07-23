import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default () => {
  return (
    <>
      <p>Enter the URI from the server console. This is provided when you start the server.</p>
      <TextField id="filled-basic" label="Server URI" variant="filled" />
    </>
  )
}


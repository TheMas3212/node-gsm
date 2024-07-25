import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default () => {
  const [serverURIProvided, setServerURIProvided] = useState(false);
  const [serverNicknameProvided, setServerNicknameProvided] = useState(false);
  const [formData, setFormData] = useState({});

  const isValidKey = (value) => {
    return /[a-z\d]+/i.test(value);
  }

  const isValidNickname = (value) => {
    return /[a-z\d]+/i.test(value);
  }

  const getURLparams = (url, keys) => {
    try {
      const response = {};
      const hashParams = new URLSearchParams(url.hash.substring(1)); // Remove the '#'
      if (keys.indexOf('key') > -1) {
        const keyValue = hashParams.get('key');
        response.key = keyValue !== null && isValidKey(keyValue) && keyValue;
      }
      if (keys.indexOf('nickname') > -1) {
        const nicknameValue = hashParams.get('nickname');
        response.nickname = nicknameValue !== null && isValidNickname(nicknameValue) && nicknameValue;
      }
      
      return response;
    } catch (error) {
      return false; // Invalid URL
    }
  }

  const handleServerURIProvided = ({target: {value}}) => {
    if (!value) return;
    const url = new URL(value);
    const urlParams = getURLparams(url, ['key', 'nickname']);
    if (urlParams === false) return;
    if (urlParams.key === false) return;
    const newData = {};
    newData["serverURI"]="";
    newData["serverKey"]=urlParams.key;
    setServerURIProvided(true);
    if (urlParams.nickname !== false) {
      newData["serverNickname"]=urlParams.nickname;
      setServerNicknameProvided(true);
    }
    setFormData({...formData,...newData});
  };

  const handleServerNicknameProvided = ({target: {value}}) => {
    if (isValidNickname(value)) {
      setFormData({...formData,"serverNickname":value})
      setServerNicknameProvided(true);
    }
  };

  const handleSubmit = () => {
    console.log(formData);
  }

  return (
    <>
      <div>
        <p>Enter the URI from the server console. This is provided when you start the server.</p>
        <TextField id="serverURI" label="Server URI" variant="filled" onBlur={handleServerURIProvided}/>
      </div>
      {serverURIProvided ?
      <div>
        <p>Provide a Nickname to identify this server easier.</p>
        <TextField
          id="serverNickname"
          label="Server Nickname"
          variant="filled"
          value={formData.serverNickname}
          onBlur={handleServerNicknameProvided}
        />
      </div>
      : ""}
      {serverNicknameProvided ?
      <div>
        <Button sx={{marginTop: "20px"}} variant="contained" onClick={handleSubmit}>Looks Good!</Button>
      </div>
      : ""}
    </>
  );
}


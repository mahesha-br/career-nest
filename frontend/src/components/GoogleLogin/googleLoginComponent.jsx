import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';

const GoogleLoginComponent = (props) => {
  const navigate =useNavigate();
  const handleOnSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    const res = await API.post(
      '/api/auth/google',
      { token },
      { withCredentials: true }
    );
    // Optionally save user info
     localStorage.setItem('isLogin', 'true');
     localStorage.setItem('userInfo', JSON.stringify(res.data.user));
     props.changeLoginValue(true)
     navigate('/feeds')
  };

  return (
    <div className='w-full'>
      <GoogleLogin
        onSuccess={handleOnSuccess}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </div>
  );
};

export default GoogleLoginComponent;

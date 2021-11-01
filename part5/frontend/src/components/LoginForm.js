import React, { useState } from 'react';
import loginService from '../services/login';
import PropTypes from 'prop-types';

const LoginForm = ({ setUser, setNotification, setErrorMessage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async event => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      setUsername('');
      setPassword('');
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (exception) {
      setNotification('wrong username or password');
      setErrorMessage('error');
    }
  };
  return (
    <>
      <h2>log in to the application</h2>
      <form id='login-form' onSubmit={handleLogin}>
        <div>
          <label htmlFor='username'>Username: </label>
          <input
            id='username'
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <label htmlFor='password'>Password: </label>
          <input
            id='password'
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='login-button' type='submit'>login</button>
      </form>
    </>
  );
};

LoginForm.propTypes = {
  setUser: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
};

export default LoginForm;
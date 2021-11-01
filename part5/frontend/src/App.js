import React, { useState } from 'react';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import Blogs from './components/Blogs';

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  return (
    <div>
      <Notification
        message={notification}
        type={errorMessage}
        setNotification={setNotification}
        setErrorMessage={setErrorMessage}
      />
      {user ? (
        <Blogs
          user={user}
          setUser={setUser}
          setNotification={setNotification}
          setErrorMessage={setErrorMessage}
        />
      ) : (
        <LoginForm
          setUser={setUser}
          setNotification={setNotification}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};

export default App;

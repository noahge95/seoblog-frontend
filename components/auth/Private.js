import { useEffect } from 'react';
import Router from 'next/router';
import { isAuth } from '../../actions/auth';

const Private = ({ children }) => {
    // here we make sure the user is authenticated
  useEffect(() => {
    if (!isAuth()) {
      Router.push('/signin');
    }
  }, []);

  return <>{children}</>;
};

export default Private;

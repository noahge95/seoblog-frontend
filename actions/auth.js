import fetch from 'isomorphic-fetch';
import { API } from '../config';
import cookie from 'js-cookie';
import Router from 'next/router';

export const handleResponse = (response) => {
  // if response status code is 401 (token expired and unauthorized)

  // 1. we want to delete the user from local storage
  // 2. re-direct to sign in page

  if (response.status === 401) {
    signout(() => {
      Router.push({
        pathname: '/signin',
        query: {
          message: 'Your session has expired, please sign-in',
        },
      });
    });
  } else {
    return;
  }
};
// For account activation
export const preSignup = (user) => {
  return fetch(`${API}/pre-signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

////////// SIGNUP ///////////
// This will send the name email and password to the api
// api responds with message or errors
export const signup = (user) => {
  return fetch(`${API}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

////////// SIGNIN ///////////
// This will send the email and password to the api
// api responds with token and user or errors
export const signin = (user) => {
  return fetch(`${API}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

////////// SIGNOUT ///////////
// We remove the token and the user in local storage (client side)

// next is used here as that is the callback function we pass in
// in this case it will be a redirect function
export const signout = (next) => {
  removeCookie('token');
  removeLocalStorage('user');
  next();

  return fetch(`${API}/signout`, {
    method: 'GET',
  })
    .then((response) => {
      console.log('signout sucess');
    })
    .catch((err) => {
      console.log(err);
    });
};

////////// SET COOKIE ///////////
// pass the token value and key into the cookie
export const setCookie = (key, value) => {
  // if next is running client side
  if (process.browser) {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};

////////// REMOVE COOKIE ///////////
// remove the token value from the cookie
export const removeCookie = (key) => {
  // if next is running client side
  if (process.browser) {
    cookie.remove(key);
  }
};

////////// GET COOKIE ///////////
// we then need to get that cookie so we can authenticate
// the key we are using is ('token') when we call getCookie
export const getCookie = (key) => {
  // if next is running client side
  if (process.browser) {
    return cookie.get(key);
  }
};

////////// PERSIST LOCAL STORAGE ///////////
// functions that allow us to set data in local storage
export const setLocalStorage = (key, value) => {
  if (process.browser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeLocalStorage = (key) => {
  if (process.browser) {
    localStorage.removeItem(key);
  }
};

////////// AUTHENTICATE ///////////
// here we authenticate the client by setting the cookie in browser
// and adding the user to local storage

// middleware
export const authenticate = (data, next) => {
  setCookie('token', data.token);
  setLocalStorage('user', data.user);
  // we use next here because within the SigninComponent we call it
  // with a callback as the last argument
  next();
};

// when a user is signed in a cookie is sent to us
// we can retrieve the token from the cookie
// we will then return the user that is saved in localStorage if that exists
export const isAuth = () => {
  if (process.browser) {
    // we check the cookie to see if it exists
    const cookieChecked = getCookie('token');
    // if the cookie exists we have a valid user
    if (cookieChecked) {
      // if there is a user in local storage we create a user object
      if (localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user'));
      } else {
        return false;
      }
    }
  }
};

export const updateUser = (user, next) => {
  if (process.browser) {
    if (localStorage.getItem('user')) {
      let auth = JSON.parse(localStorage.getItem('user'));
      auth = user;
      localStorage.setItem('user', JSON.stringify(auth));
      next();
    }
  }
};

export const forgotPassword = (email) => {
  return fetch(`${API}/forgot-password`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(email),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const resetPassword = (resetInfo) => {
  return fetch(`${API}/reset-password`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resetInfo),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};


export const loginWithGoogle = (user) => {
  return fetch(`${API}/google-login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};



import Router from 'next/router';
import { useState, useEffect } from 'react';
import { signup, isAuth, preSignup } from '../../actions/auth';

const SignupComponent = () => {
  // create a useEffect to see if they are logged in
  // if they are redirect to home page use isAuth()
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    errors: '',
    loading: false,
    message: '',
    showForm: true,
  });

  const { name, email, password, error, loading, message, showForm } = values;

  // everytime there is a change in the state the useEffect
  // hook will run automatically
  useEffect(() => {
    // get the authenticated user from local storage.
    // if this returns our user, that means the user is logged in.
    // so if the returned user exists that means isAuth is true.
    isAuth() && Router.push(`/`);
  }, []);

  const handleSubmit = (e) => {
    // prevent default action
    e.preventDefault();
    // console.table({ name, email, password, error, loading, message, showForm });
    // on sumbit we want to set loading to true and error to false
    setValues({ ...values, loading: true, error: false });
    // we assign the user object, with the information submitted
    const user = { name, email, password };

    // we then send the user data to the api,
    // after the promise is resolved we then get back from the api
    // some json data response, if there is a data.error property
    // we set our state that there is an error and loading stops.
    preSignup(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        setValues({
          ...values,
          name: '',
          email: '',
          password: '',
          error: '',
          loading: false,
          message: data.message,
          showForm: false,
        });
      }
    });
  };
  // Each time we change anything within our form it is updated
  // in the state so it can be displayed in the form fields.
  const handleChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  const showLoading = () =>
    loading ? <div className="alert alert-info">Loading...</div> : '';

  const showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : '';

  const showMessage = () =>
    message ? <div className="alert alert-info">{message}</div> : '';

  const signupForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            value={name}
            onChange={handleChange('name')}
            type="text"
            className="form-control"
            placeholder="Please type name"
          />
        </div>
        <div className="form-group">
          <input
            value={email}
            onChange={handleChange('email')}
            type="email"
            className="form-control"
            placeholder="Please type email"
          />
        </div>
        <div className="form-group">
          <input
            value={password}
            onChange={handleChange('password')}
            type="password"
            className="form-control"
            placeholder="Please type password"
          />
        </div>

        <div>
          <button className="btn btn-primary">Signup</button>
        </div>
      </form>
    );
  };

  return (
    <>
      {showError()}
      {showLoading()}
      {showMessage()}
      {/* Here we are saying if showForm is true then display the form
      we don't want to show the form on a successful responce*/}
      {showForm && signupForm()}
    </>
  );
};

export default SignupComponent;

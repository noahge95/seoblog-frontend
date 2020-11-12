import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import Layout from '../../../../components/Layout';
import { withRouter } from 'next/router';
import { signup } from '../../../../actions/auth';

// in this file we want to get the token from the url query.
// and then send that token to the back end signup endpoint.

const ActivateAccount = ({ router }) => {
  const [values, setValues] = useState({
    name: '',
    token: '',
    error: '',
    loading: false,
    success: false,
    showButton: true,
  });

  const { name, token, error, loading, success, showButton } = values;

  // on router change we want to get the token.
  useEffect(() => {
    let token = router.query.id;
    // we decode the token here so we can display the name (better ux)
    // we don't have to do this.
    if (token) {
      const { name } = jwt.decode(token);
      setValues({ ...values, name, token });
    }
  }, [router]);

  const clickSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    signup({ token }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false, showButton: false });
      } else {
        setValues({ ...values, loading: false, success: true, showButton: false });
      }
    });
  };

  const showLoading = () => (loading ? <h2>Loading...</h2> : '');

  return (
    <Layout>
      <div className="container">
        <h3> Hey {name}, Ready to activate your account? </h3>
        {showLoading()}
        {error && error}
        {success && 'You have successfully activated your account. Please signin.'}
        {showButton && (
          <button className="btn btn-outline-primary" onClick={clickSubmit}>
            Activate Account
          </button>
        )}
      </div>
    </Layout>
  );
};

export default withRouter(ActivateAccount);

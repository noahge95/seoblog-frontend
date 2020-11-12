// We don't need a separate component for this page.
// as this component will not be re-used.

import { useState } from 'react';
import Layout from '../../../../components/Layout';
import { withRouter } from 'next/router';
import { resetPassword } from '../../../../actions/auth';

const ResetPassword = ({ router }) => {
  const [values, setValues] = useState({
    name: '',
    newPassword: '',
    error: '',
    message: '',
    showForm: true,
  });

  const { name, newPassword, message, error, showForm } = values;

  const handleSubmit = (e) => {
    console.log(router.query);

    e.preventDefault();

    setValues({ ...values, message: '', error: '' });

    resetPassword({ newPassword, resetPasswordLink: router.query.id }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, showForm: false, newPassword: '' });
      } else {
        setValues({
          ...values,
          message: data.message,
          email: false,
          showForm: false,
          newPassword: '',
        });
      }
    });
  };

  const showError = () => {
    return error ? <div className="alert alert-danger">{error}</div> : '';
  };
  const showMessage = () => {
    return message ? <div className="alert alert-success">{message}</div> : '';
  };

  const passwordResetForm = () => (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group pt-5">
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => {
              setValues({ ...values, newPassword: e.target.value });
            }}
            placeholder="Type new password"
            required
          />
        </div>

        <div>
          <button className="btn btn-primary">Change password</button>
        </div>
      </form>
    </div>
  );

  return (
    <Layout>
      <div className="container-fluid">
        <h2>Reset Password</h2>
        <hr />
        {showError()}
        {showMessage()}
        {showForm && passwordResetForm()}
      </div>
    </Layout>
  );
};

export default withRouter(ResetPassword);

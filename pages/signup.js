import Layout from '../components/Layout';
import SignupComponent from '../components/auth/SignupComponent';

// We enclose with Layout as that is our template
// We then add children into the Layout
const Signup = () => (
  <Layout>
    <h2 className="text-center pt-4 pb-4">Signup page</h2>
    <div className="row">
      <div className="col-md-6 offset-md-3">
        <SignupComponent />
      </div>
    </div>
  </Layout>
);

export default Signup;

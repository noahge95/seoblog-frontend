import Layout from '../../components/Layout';
import Private from '../../components/auth/Private';
import ProfileUpdate from '../../components/auth/ProfileUpdate';

// We enclose with Layout as that is our template
// We then add children into the Layout
const UserProfileUpdate = () => (
  <Layout>
    <Private>
      <div className="container-fluid">
        <div className="row">
          <ProfileUpdate />
        </div>
      </div>
    </Private>
  </Layout>
);

export default UserProfileUpdate;

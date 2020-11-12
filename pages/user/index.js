import Layout from '../../components/Layout';
import Private from '../../components/auth/Private';

import Link from 'next/link';

// We enclose with Layout as that is our template
// We then add children into the Layout
const UserIndex = () => (
  <Layout>
    <Private>
      <div className="container-fluid">
        <h2>User Dashboard</h2>
        <div className="row">
          <div className="col-md-4">
            <ul className="list-group">
              <li className="list-group-item">
                <Link href="/user/crud/blog">
                  <a>Create Blog</a>
                </Link>
              </li>

              <li className="list-group-item">
                <Link href="/user/crud/blogs">
                  <a>Update/Delete Blogs</a>
                </Link>
              </li>

              <li className="list-group-item">
                <Link href="/user/update">
                  <a>Update Profile</a>
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-8">right</div>
        </div>
      </div>
    </Private>
  </Layout>
);

export default UserIndex;

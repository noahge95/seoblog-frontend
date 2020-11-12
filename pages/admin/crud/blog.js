import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import BlogCreate from '../../../components/crud/BlogCreate';
import Link from 'next/link';

// We enclose with Layout as that is our template
// We then add children into the Layout
const Blog = () => (
  <Layout>
    <Admin>
      <div className="row">
        <div className="col-md-12 pt-5 pb-5">
          <h2>Create a new blog</h2>
        </div>
        <div className="col-md-12">
          <BlogCreate />
        </div>
      </div>
    </Admin>
  </Layout>
);

export default Blog;

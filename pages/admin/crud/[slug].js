import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import BlogUpdate from '../../../components/crud/BlogUpdate';
import Link from 'next/link';

// We enclose with Layout as that is our template
// We then add children into the Layout
const Blog = () => (
  <Layout>
    <Admin>
      <div className="row">
        <div className="col-md-12 pt-5 pb-5">
          <h2>Update a blog</h2>
        </div>
        <div className="col-md-12">
          <BlogUpdate />
        </div>
      </div>
    </Admin>
  </Layout>
);

export default Blog;

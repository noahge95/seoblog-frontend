import Layout from '../../../components/Layout';
import Private from '../../../components/auth/Private';
import BlogUpdate from '../../../components/crud/BlogUpdate';

// We enclose with Layout as that is our template
// We then add children into the Layout
const Blog = () => (
  <Layout>
    <Private>
      <div className="row">
        <div className="col-md-12 pt-5 pb-5">
          <h2>Update a blog</h2>
        </div>
        <div className="col-md-12">
          <BlogUpdate />
        </div>
      </div>
    </Private>
  </Layout>
);

export default Blog;

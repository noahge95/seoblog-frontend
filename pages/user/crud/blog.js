import Layout from '../../../components/Layout';
import Private from '../../../components/auth/Private';
import BlogCreate from '../../../components/crud/BlogCreate';

// We enclose with Layout as that is our template
// We then add children into the Layout
const CreateBlog = () => (
  <Layout>
    <Private>
      <div className="row">
        <div className="col-md-12 pt-5 pb-5">
          <h2>Create a new blog</h2>
        </div>
        <div className="col-md-12">
          <BlogCreate />
        </div>
      </div>
    </Private>
  </Layout>
);

export default CreateBlog;

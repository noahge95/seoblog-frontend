import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import Category from '../../../components/crud/Category';
import Tag from '../../../components/crud/Tag';
import Link from 'next/link';

// We enclose with Layout as that is our template
// We then add children into the Layout
const CategoryTag = () => (
  <Layout>
    <Admin>
      <div className="row">
        <div className="col-md-12 pt-5 pb-5">
          <h2>Manage Categories and Tags</h2>
        </div>
        <div className="col-md-6">
          <h2>Categories</h2>
          <Category />
        </div>
        <div className="col-md-6">
          <h2>Tags</h2>
          <Tag />
        </div>
      </div>
    </Admin>
  </Layout>
);

export default CategoryTag;

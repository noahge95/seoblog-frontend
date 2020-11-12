import Layout from '../components/Layout';
import ContactForm from '../components/form/ContactForm';
import Link from 'next/link';

// We enclose with Layout as that is our template
// We then add children into the Layout
const Contact = () => (
  <Layout>
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h2>Contact form</h2>
          <hr />
          <ContactForm />
        </div>
      </div>
    </div>
  </Layout>
);

export default Contact;

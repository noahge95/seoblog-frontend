// This page will dynamically change based on the router slug.

import Head from 'next/head';
import Link from 'next/link';
import SmallCard from '../../components/blog/SmallCard';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react'; // for related blogs
import { getSingleBlog, listRelated } from '../../actions/blog';
import { API, DOMAIN, APP_NAME } from '../../config';
import moment from 'moment';
import renderHTML from 'react-render-html';
import DisqusThread from '../../components/DisqusThread';

// This is an SSR Page
// Data is loaded from the API and is then used to render the page
// server side and then send it to the client.

const SingleBlog = ({ blog, query }) => {
  const [related, setRelated] = useState([]);

  const loadRelated = () => {
    listRelated({ blog }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setRelated(data);
      }
    });
  };
  // we want to run this when the component mounts
  useEffect(() => {
    loadRelated();
  }, []);

  // We want each blog to have its own SEO so we will create a custom head for each page.
  const head = () => (
    <Head>
      <title>
        {blog.title} | {APP_NAME}
      </title>
      <meta name="description" content={blog.mdesc} />

      <link rel="canonical" href={`${DOMAIN}/blogs/${query.slug}`} />
      <meta property="og:title" content={`${blog.title} | ${APP_NAME}`} />
      <meta property="og:description" content={blog.mdesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/blogs/${query.slug}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta property="og:image" content={`${API}/blog/photo/${blog.photo}`} />
      <meta property="og:image:secure_url" content={`${API}/blog/photo/${blog.photo}`} />
      <meta property="og:image:type" content="image/jpg" />
    </Head>
  );

  const showBlogCategories = (blog) => {
    return blog.categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
      </Link>
    ));
  };

  const showBlogTags = (blog) => {
    return blog.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`}>
        <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{t.name}</a>
      </Link>
    ));
  };

  const showRelatedBlogs = () => {
    return related.map((blog, i) => (
      <div key={i} className="col-md-4">
        <article>
          <SmallCard blog={blog} />
        </article>
      </div>
    ));
  };

  const showComments = () => {
    return (
      <div>
        <DisqusThread
          id={blog._id}
          title={blog.title}
          path={`/blog/${blog.slug}`}
        ></DisqusThread>
      </div>
    );
  };

  return (
    <>
      {head()}
      <Layout>
        <main>
          <article>
            <div className="container-fluid">
              <section>
                <div className="row" style={{ marginTop: '-30px' }}>
                  <img
                    src={`${API}/blog/photo/${blog.slug}`}
                    alt={blog.title}
                    className="img img-fluid featured-image"
                  />
                </div>
              </section>
              <section>
                <div className="container">
                  <h1 className="display-2 pb-3 text-center font-weight-bold">
                    {blog.title}
                  </h1>
                  <p className="lead mt-3 mark">
                    Written by{' '}
                    <Link href={`/profile/${blog.postedBy.username}`}>
                      <a>{blog.postedBy.username}</a>
                    </Link>{' '}
                    | Published {moment(blog.updatedAt).fromNow()}
                  </p>

                  <div className="pb-3">
                    {showBlogCategories(blog)}
                    {showBlogTags(blog)}
                    <br />
                    <br />
                  </div>

                  <div className="container">
                    <section>
                      <div className="col-md-12 lead">{renderHTML(blog.body)}</div>
                    </section>
                  </div>

                  <div className=" container pb-5">
                    <p> Related Blogs</p>
                    <hr />
                    <div className="row">{showRelatedBlogs()}</div>
                  </div>

                  <div className=" container pt-5 pb-5">
                    <hr />
                    {showComments()}
                  </div>
                </div>
              </section>
            </div>
          </article>
        </main>
      </Layout>
    </>
  );
};
// getInitialProps Must return something.
// we use query insted of router for getInitialProps
// this is because getInitialProps occurs before client side is rendered
SingleBlog.getInitialProps = ({ query }) => {
  return getSingleBlog(query.slug).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      // This method runs server side first so the console log will
      // printed to the console on the first load of the page.
      // you won't see this in the browser but in the terminal of
      // this next js app as this method runs server side.
      //   console.log('GET INITIAL PROPS IN SINGLE BLOG', data);
      return { blog: data, query };
    }
  });
};

export default SingleBlog;

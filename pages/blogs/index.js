// This page is where we show our blogs
// we server side render this page for the user

import Head from 'next/head'; // we want to include a meta title and meta description
import Link from 'next/link'; //
import { withRouter } from 'next/router'; // we want access to pathname to use in head tag.
import Layout from '../../components/Layout';
import { useState } from 'react';
import { listBlogsWithCategoriesAndTags } from '../../actions/blog';
import Card from '../../components/blog/Card';
import { API, DOMAIN, APP_NAME } from '../../config';

// We pass in the returned data from the getInitialProps life cycle method
// so we are passing the properties returned from getInitialProps
const Blogs = ({
  blogs,
  categories,
  tags,
  totalBlogs,
  blogsLimit,
  blogsSkip,
  router,
}) => {
  // create the head for better SEO performance

  // The canonical url is the url which we want to rank in the search engine
  // so blogs/:slug wont be ranked but blogs/ will be

  // <meta property="og:title" is used by facebook to display images and text
  // on facebook pages og means open graph
  const head = () => (
    <Head>
      <title>Programming blogs | {APP_NAME}</title>
      <meta
        name="description"
        content="Programming blogs and tutorials on react node next vue php laravel and web development"
      />

      <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
      <meta
        property="og:title"
        content={`Latest web development tutorials | ${APP_NAME}`}
      />
      <meta
        property="og:description"
        content="Programming blogs and tutorials on react node next vue php laravel and web development"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta property="og:image" content={`${DOMAIN}/static/imgs/blogmain.jpg`} />
      <meta
        property="og:image:secure_url"
        content={`${DOMAIN}/static/imgs/blogmain.jpg`}
      />
      <meta property="og:image:type" content="image/jpg" />
    </Head>
  );

  // On the first load we only want 2 blogs
  const [limit, setLimit] = useState(blogsLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalBlogs);
  // If user clicks view more blogs, they will be added to state.
  const [loadedBlogs, setLoadedBlogs] = useState([]);

  const loadMore = () => {
    let toSkip = skip + limit;
    listBlogsWithCategoriesAndTags(toSkip, limit).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setLoadedBlogs([...loadedBlogs, ...data.blogs]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };
  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className="btn btn-outline-primary btn-lg">
          Load more
        </button>
      )
    );
  };

  const showAllCategories = () => {
    return categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
      </Link>
    ));
  };
  const showAllTags = () => {
    return tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`}>
        <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{t.name}</a>
      </Link>
    ));
  };

  // This function is for loading the initial 2 blogs
  const showAllBlogs = () => {
    return blogs.map((blog, i) => (
      <article key={i}>
        <Card blog={blog} />
        <hr />
      </article>
    ));
  };

  // This function is for loading extra blogs if requested by clicking load more
  const showLoadedBlogs = () => {
    return loadedBlogs.map((blog, i) => (
      <article key={i}>
        <Card blog={blog} />
        <hr />
      </article>
    ));
  };

  return (
    <>
      {head()}
      <Layout>
        <main>
          <div className="container-fluid">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold text-center">
                  Programming blogs and tutorials
                </h1>
              </div>
              <section>
                <div className="pb-5 text-center">
                  {showAllCategories()}
                  <br></br>
                  {showAllTags()}
                </div>
              </section>
            </header>
          </div>
          <div className="container-fluid">{showAllBlogs()}</div>
          <div className="container-fluid">{showLoadedBlogs()}</div>
          <div className="text-center pb-5 pt-5">{loadMoreButton()}</div>
        </main>
      </Layout>{' '}
    </>
  );
};

// getInitialProps
// getInitialProps is a life cycle method from nextjs
// getInitialProps can only be used on pages not components

// getInitialProps runs on the server side (so on this computer)
// it gets the responce from the API and then renders the page
// This will make the page SSR Server side rendered.

// So the first time this page is rendered its done by the server
// but if you navigate around on the page as the client it will be
// CSR Client side rendered becasuse those other pages have be pre fetched

// Here we get the data from the backend server(api)
// and the data must be returned from getInitialProps
// so we can use it in the component

// The getInitialProps method provides these properties/ api data
// To the component
Blogs.getInitialProps = () => {
  let skip = 0;
  let limit = 2;

  return listBlogsWithCategoriesAndTags(skip, limit).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      return {
        blogs: data.blogs,
        categories: data.categories,
        tags: data.tags,
        totalBlogs: data.size,
        blogsLimit: limit,
        blogsSkip: skip,
      };
    }
  });
};

export default withRouter(Blogs);

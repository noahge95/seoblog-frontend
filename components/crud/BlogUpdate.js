import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router'; // allows us to get router properties
import { getCookie, isAuth } from '../../actions/auth';
import { getCategories } from '../../actions/category';
import { getTags } from '../../actions/tag';
import { getSingleBlog, updateBlog } from '../../actions/blog';
import { QuillModules, QuillFormats } from '../../helpers/quill';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import '../../node_modules/react-quill/dist/quill.snow.css';
import { API } from '../../config';

const BlogUpdate = ({ router }) => {
  const [body, setBody] = useState('');

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checked, setChecked] = useState([]); // categories
  const [checkedTag, setCheckedTag] = useState([]); // tags

  const [values, setValues] = useState({
    error: '',
    success: '',
    formData: '',
    title: '',
  });

  const { error, success, formData, title } = values;
  const token = getCookie('token');

  useEffect(() => {
    setValues({ ...values });
    // on component mount we make request to backend for blog.
    initBlog();
    initCategories();
    initTags();
    // we pass in router as a dependency so that if we
    // change page or reload we will run useEffect
  }, [router]);

  // useEffect(() => {
  //   console.log(checked);
  //   console.log(checkedTag);
  // }, []);

  const initBlog = () => {
    if (router.query.slug) {
      getSingleBlog(router.query.slug).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({ ...values, title: data.title, formData: new FormData() });
          setBody(data.body);
          setCategoriesArray(data.categories);
          setTagsArray(data.tags);
        }
      });
    }
  };

  const setCategoriesArray = (blogCategories) => {
    let ca = [];
    // we place each categories id into the array
    blogCategories.map((c, i) => {
      ca.push(c._id);
    });
    setChecked(ca);
  };

  const setTagsArray = (blogTags) => {
    let ta = [];
    // we place each categories id into the array
    blogTags.map((t, i) => {
      ta.push(t._id);
    });
    setCheckedTag(ta);
  };

  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCategories(data);
      }
    });
  };
  const initTags = () => {
    getTags().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setTags(data);
      }
    });
  };

  const findOutCategory = (c) => {
    const result = checked.indexOf(c); // returns true or -1
    // so if rturns true and category exisits
    if (result !== -1) {
      return true;
    } else return false;
  };

  const findOutTag = (t) => {
    const result = checkedTag.indexOf(t); // returns true or -1
    // so if rturns true and tag exisits
    if (result !== -1) {
      return true;
    } else return false;
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleToggle(c._id)}
            // it will be initialised as checked if it is
            // present in the state
            checked={findOutCategory(c._id)}
            type="checkbox"
            className="mr-2"
          ></input>
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  const showTags = () => {
    return (
      tags &&
      tags.map((t, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleTagToggle(t._id)}
            // it will be initialised as checked if it is
            // present in the state
            checked={findOutTag(t._id)}
            type="checkbox"
            className="mr-2"
          ></input>
          <label className="form-check-label">{t.name}</label>
        </li>
      ))
    );
  };

  const handleToggle = (category) => () => {
    setValues({ ...values, error: '' });

    const clickedCategory = checked.indexOf(category);
    const all = [...checked];

    if (clickedCategory === -1) {
      all.push(category);
    } else {
      all.splice(clickedCategory, 1);
    }
    console.log(all);
    setChecked(all);
    formData.set('categories', all);
  };

  const handleTagToggle = (tag) => () => {
    setValues({ ...values, error: '' });

    const clickedTag = checkedTag.indexOf(tag);
    const all = [...checkedTag];

    if (clickedTag === -1) {
      all.push(tag);
    } else {
      all.splice(clickedTag, 1);
    }
    console.log(all);
    setCheckedTag(all);
    formData.set('tags', all);
  };

  const handleChange = (name) => (e) => {
    const value = name === 'photo' ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, error: '' });
  };

  const handleBody = (e) => {
    setBody(e);
    formData.set('body', e);
  };

  const editBlog = (e) => {
    e.preventDefault();
    updateBlog(formData, token, router.query.slug).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          title: '',
          success: `Blog titled "${data.title}" is successfully updated`,
        });
        // if (isAuth() && isAuth().role === 1) {
        //   //Router.replace(`/admin/crud/${router.query.slug}`);
        //   Router.replace(`/admin`);
        // } else if (isAuth() && isAuth().role === 0) {
        //   //Router.replace(`/user/crud/${router.query.slug}`);
        //   Router.replace(`/user`);
        // }
      }
    });
  };

  const showError = () => {
    <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
      {error}
    </div>;
  };
  const showSuccess = () => {
    <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
      {success}
    </div>;
  };

  const updateBlogForm = () => {
    return (
      <form onSubmit={editBlog}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={handleChange('title')}
          />
        </div>

        <div className="form-group">
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder="Write something ... A blog... duh!"
            onChange={handleBody}
          />
        </div>

        <div>
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          {updateBlogForm()}

          <div className="pt-3">
            {showError()}
            {showSuccess()}
          </div>
          {body && (
            <img
              src={`${API}/blog/photo/${router.query.slug}`}
              alt={title}
              style={{ width: '100%' }}
            ></img>
          )}
        </div>
        <div className="col-md-4">
          <div className="form-group pb-2">
            <h5>Featured image</h5>
            <hr />
            <small className="text-muted">Max size: 1mb</small>
            <label className="btn btn-outline-info">
              Upload featured image
              <input
                onChange={handleChange('photo')}
                type="file"
                accept="image/*"
                hidden
              ></input>
            </label>
          </div>
          <div>
            <h5>Categories</h5>
            <hr />
            <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>
              {showCategories()}
            </ul>
          </div>
          <div>
            <h5>Tags</h5>
            <hr />
            <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>{showTags()}</ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(BlogUpdate);

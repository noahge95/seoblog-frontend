import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router'; // allows us to get router properties
import { getCookie, isAuth } from '../../actions/auth';
import { getCategories } from '../../actions/category';
import { getTags } from '../../actions/tag';
import { createBlog } from '../../actions/blog';

import { QuillModules, QuillFormats } from '../../helpers/quill';

// reactquill is a component so we only want to load it when necessary
// otherwise reactquill will slow down our site.
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

import '../../node_modules/react-quill/dist/quill.snow.css';

const CreateBlog = ({ router }) => {
  // Getting the blog from localstorage
  const blogFromLS = () => {
    // if the user is not in the browser retun false
    if (typeof window === 'undefined') {
      return false;
    }
    // if blog exists in storage return it from storage.
    if (localStorage.getItem('blog')) {
      return JSON.parse(localStorage.getItem('blog'));
    } else {
      return flase;
    }
  };

  // The forms state // we get the body speratly here from react quill
  // categories and tags, default to empty array as we will be adding multiple
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checked, setChecked] = useState([]); // categories
  const [checkedTag, setCheckedTag] = useState([]); // tags

  // This controls the state of the react-quill body
  // by default we set the body as that which is in storage.
  const [body, setBody] = useState(blogFromLS());
  // this controls the state of the other parts of the form.
  const [values, setValues] = useState({
    error: '',
    sizeError: '',
    success: '',
    formData: '',
    title: '',
    hidePublishButton: false,
  });

  const { error, sizeError, success, formData, title, hidePublishButton } = values;
  const token = getCookie('token');

  // every time the router changes e.g page reload we run this below
  useEffect(() => {
    // Here when the form component mounts we have the form data available
    setValues({ ...values, formData: new FormData() });
    initCategories();
    initTags();
  }, [router]);

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

  // This will be sending the data to the api.
  // and resetting our form values in state and local storage.
  const publishBlog = (e) => {
    //console.log(...formData);

    e.preventDefault();
    createBlog(formData, token).then((data) => {
      console.log(data.error);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          title: '',
          error: '',
          success: `A new blog titled ${data.title} is created`,
        });
        setBody('');
        setCategories([]);
        setTags([]);
      }
    });

    //console.log('Publishing');
  };

  // making sure our state gets updated as we change the text in the fields
  const handleChange = (name) => (e) => {
    //console.log(e.target.value);
    // if we are changing photo we want the files not the value
    // other names we want the value
    const value = name === 'photo' ? e.target.files[0] : e.target.value;
    // this formData is set and ready to send to the backend to create new blog.
    formData.set(name, value);
    // set the values in the state so we can then see the changes
    setValues({ ...values, [name]: value, formData, error: '' });
  };

  // handles our react quill changes
  const handleBody = (e) => {
    // we save the body in state
    setBody(e);
    // we set the formData property 'body' with e (the blog)
    formData.set('body', e);
    // typeof window !== 'undefined' to check to see if the script is being run in a web-page inside a web-browser
    // if not undefined so the window is defined.
    // we save in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('blog', JSON.stringify(e));
    }
  };

  // here we push or pull the category or tag from the state.
  // we take the category_id and return a function
  const handleToggle = (category) => () => {
    setValues({ ...values, error: '' });
    // return the index of the clickedCategory or -1

    const clickedCategory = checked.indexOf(category);
    const all = [...checked];

    // if checked.indexOf(category) returns -1 that means category is not in state.
    // so we need to push it into state

    // else we want to remove it from state as we toggle back an forth.
    if (clickedCategory === -1) {
      all.push(category);
    } else {
      all.splice(clickedCategory, 1);
    }
    //console.log(all);
    // set our state
    setChecked(all);
    // update the form data in state that will be sent to the backend
    formData.set('categories', all);
  };

  const showCategories = () => {
    // if categories exist then map through the array
    return (
      categories &&
      categories.map((category, index) => (
        <li key={index} className="list-unstyled">
          <input
            onChange={handleToggle(category._id)}
            type="checkbox"
            className="mr-2"
          ></input>
          <label className="form-check-label">{category.name}</label>
        </li>
      ))
    );
  };

  const handleTagToggle = (tag) => () => {
    setValues({ ...values, error: '' });
    // return the index of the clickedtag or -1

    const clickedTag = checkedTag.indexOf(tag);
    const all = [...checkedTag];

    // if checkedTag.indexOf(tag) returns -1 that means tag is not in state.
    // so we need to push it into state

    // else we want to remove it from state as we toggle back an forth.
    if (clickedTag === -1) {
      all.push(tag);
    } else {
      all.splice(clickedTag, 1);
    }
    //console.log(all);
    // set our state
    setCheckedTag(all);
    // update the form data in state that will be sent to the backend
    formData.set('tags', all);
  };

  const showTags = () => {
    // if categories exist then map through the array
    return (
      tags &&
      tags.map((tag, index) => (
        <li key={index} className="list-unstyled">
          <input
            onChange={handleTagToggle(tag._id)}
            type="checkbox"
            className="mr-2"
          ></input>
          <label className="form-check-label">{tag.name}</label>
        </li>
      ))
    );
  };

  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  );

  const showSuccess = () => (
    <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
      {success}
    </div>
  );

  // this is where our form is shown.
  // and where we enter our blog text
  const createBlogForm = () => {
    return (
      <form onSubmit={publishBlog}>
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
            Publish
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          {createBlogForm()}

          <div className="pt-3">
            {showError()}
            {showSuccess()}
          </div>
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

// we use withRouter so we have access to next router
// so we can grab props from the router
export default withRouter(CreateBlog);

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { isAuth, getCookie } from '../../actions/auth';
import { create, getCategories, removeCategory } from '../../actions/category';

const Category = () => {
  // Create our state here
  const [values, setValues] = useState({
    name: '',
    error: false,
    success: false,
    categories: [],
    removed: false,
    reload: false,
  });

  // destructure the state
  const { name, error, success, categories, removed, reload } = values;
  // allow us to get the stored cookie in the browser.
  const token = getCookie('token');

  // here we control the display of categories from our api
  // when we trigger reload by using clickSubmit the useEffect "repaints/updates"
  useEffect(() => {
    loadCategories();
  }, [reload]);

  // on startup we get the categories from the back end.
  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({ ...values, categories: data });
      }
    });
  };

  const showCategories = () => {
    return categories.map((category, index) => {
      return (
        <button
          onDoubleClick={() => deleteConfirm(category.slug)}
          title="Double click to delete"
          key={index}
          className="btn btn-outline-primary mr-1 ml-1 mt-3"
        >
          {category.name}
        </button>
      );
    });
  };

  // Asks if you really want to delete.
  const deleteConfirm = (slug) => {
    let answer = window.confirm('Are you sure you want to delete this category?');
    if (answer) {
      deleteCategory(slug);
    }
  };

  const deleteCategory = (slug) => {
    // console.log('delete', slug);
    removeCategory(slug, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({
          ...values,
          error: false,
          success: false,
          name: '',
          removed: !removed,
          reload: !reload,
        });
      }
    });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    create({ name }, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, success: false });
      } else {
        setValues({
          ...values,
          error: false,
          success: true,
          name: '',
          removed: '',
          reload: !reload,
        });
      }
    });
    //console.log('create category', name);
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      name: e.target.value,
      error: false,
      success: false,
      removed: '',
    });
  };

  const showSuccess = () => {
    if (success) {
      return <p className="text-success">Category is created</p>;
    }
  };
  const showError = () => {
    if (error) {
      return <p className="text-danger">Category already Exist</p>;
    }
  };
  const showRemoved = () => {
    if (removed) {
      return <p className="text-danger">Category is Removed</p>;
    }
  };

  const mouseMoveHandler = (event) => {
    setValues({ ...values, error: false, success: false, removed: false });
  };

  // Our form here
  const newCategoryForm = () => (
    // on submit will make the request to the back end with the
    // submitted details
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange}
          value={name}
          required
        ></input>
      </div>
      <div>
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </div>
    </form>
  );

  return (
    <>
      {showSuccess()}
      {showError()}
      {showRemoved()}

      <div onMouseMove={mouseMoveHandler}>
        {newCategoryForm()}
        {showCategories()}
      </div>
    </>
  );
};

export default Category;

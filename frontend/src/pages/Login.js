import React, { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Login.module.css";
import { Button, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import axios from "axios";

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, loading: true };
    default:
      return state;
  }
}

const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Required";
  }

  return errors;
};

const initialState = {
  loading: false,
};

const Login = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      dispatch({ type: "register_pending" });
      try {
        const data = await axios.post("/api/v1/users/signup", {
          email: values.email,
          password: values.password,
        });
      } catch (err) {
        toast.error(err.response.data.message);
      }
    },
  });

  const submitFormHandler = (e) => {
    e.preventDefault();
    dispatch({ type: "login" });
  };

  return (
    <div className={classes.container}>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className={classes.login__form}>
        <img
          src="images/logo1.svg"
          alt=""
          className={classes.login__form__image}
        />
        <h1 className={classes.login__form__greeting}>Hello, Chief...</h1>
        <div className={classes.login__form__section}>
          <form onSubmit={submitFormHandler}>
            <div className={classes.form__control}>
              <div>
                <label htmlFor="email" className={classes.form__label}>
                  Email
                </label>
              </div>
              <input type="text" name="email" className={classes.form__email} />
            </div>
            <div className={classes.form__control}>
              <div>
                <label htmlFor="password" className={classes.form__label}>
                  Password
                </label>
              </div>
              <input
                type="password"
                name="password"
                className={classes.form__password}
              />
            </div>
            <div className={classes.form__control}>
              <button
                className={`${classes.login__btn} ${
                  state.loading && classes.active
                }`}
              >
                {!state.loading && "Sign in"}
                {state.loading && (
                  <Spinner
                    as="span"
                    variant="light"
                    role="status"
                    aria-hidden="true"
                    animation="border"
                  />
                )}
              </button>
            </div>
          </form>
        </div>
        <h3 style={{ marginTop: "2rem" }}>Forgot Password?</h3>
        <h3 style={{ marginTop: "2rem" }}>
          Dont have an account? <Link to="/register">Sign up</Link> here
        </h3>
      </div>

      <div className={classes.login__image}>
        <img
          src="images/loginLogo.svg"
          alt="login"
          className={classes.login__image__1}
        />
      </div>
    </div>
  );
};

export default Login;

import React, { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Register.module.css";
import { Button, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import axios from "axios";

function reducer(state, action) {
  switch (action.type) {
    case "register_pending":
      return { ...state, loading: true };
    case "register_success":
      return { ...state, loading: false };
    case "register_failed":
      return { ...state, loading: false };
    default:
      return state;
  }
}

const initialState = {
  loading: false,
};

const validate = (values) => {
  const errors = {};
  const passwordRegex = /(?=.*[0-9])/;
  if (!values.firstName) {
    errors.firstName = "Required";
  } else if (values.firstName.length > 15) {
    errors.firstName = "Must be 15 characters or less";
  }

  if (!values.lastName) {
    errors.lastName = "Required";
  } else if (values.lastName.length > 20) {
    errors.lastName = "Must be 20 characters or less";
  }

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length < 8) {
    errors.password = "Must be 8 characters or more";
  } else if (!passwordRegex.test(values.password)) {
    errors.password = "Invalid Password. Must contain one number";
  }

  if (!values.passwordConfirm) {
    errors.passwordConfirm = "Required";
  } else if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = "Passwords do not match!";
  }

  return errors;
};

const Register = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
    validate,
    onSubmit: async (values) => {
      dispatch({ type: "register_pending" });
      try {
        const data = await axios.post("/api/v1/users/signup", {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          passwordConfirm: values.passwordConfirm,
        });
        dispatch({ type: "register_success" });
        localStorage.setItem("user", JSON.stringify(data));
        toast.success("Register success!");
        navigate("/login", { replace: true });
      } catch (err) {
        toast.error(err.response.data.message);
      }
    },
  });

  return (
    <div className={classes.container}>
      <Helmet>
        <title>Register</title>
      </Helmet>
      <div className={classes.register__form}>
        <img
          src="images/logo1.svg"
          alt=""
          className={classes.register__form__image}
        />
        <h1 className={classes.register__form__greeting}>Hello, Chief...</h1>
        <div className={classes.register__form__section}>
          <form onSubmit={formik.handleSubmit}>
            <div className={classes.form__control}>
              <div>
                <label htmlFor="firstName" className={classes.form__label}>
                  First Name
                </label>
                {formik.errors.firstName ? (
                  <div style={{ color: "red", fontSize: "1rem" }}>
                    {formik.errors.firstName}
                  </div>
                ) : null}
              </div>
              <input
                type="text"
                id="firstName"
                name="firstName"
                onChange={formik.handleChange}
                value={formik.values.firstName}
                className={classes.form__name}
              />
            </div>
            <div className={classes.form__control}>
              <div>
                <label htmlFor="lastName" className={classes.form__label}>
                  Last Name
                </label>
                {formik.errors.lastName ? (
                  <div style={{ color: "red", fontSize: "1rem" }}>
                    {formik.errors.lastName}
                  </div>
                ) : null}
              </div>
              <input
                type="text"
                id="lastName"
                name="lastName"
                onChange={formik.handleChange}
                value={formik.values.lastName}
                className={classes.form__name}
              />
            </div>
            <div className={classes.form__control}>
              <div>
                <label htmlFor="email" className={classes.form__label}>
                  Email
                </label>
                {formik.errors.email ? (
                  <div style={{ color: "red", fontSize: "1rem" }}>
                    {formik.errors.email}
                  </div>
                ) : null}
              </div>
              <input
                type="email"
                name="email"
                id="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                className={classes.form__email}
              />
            </div>
            <div className={classes.form__control}>
              <div>
                <label htmlFor="password" className={classes.form__label}>
                  Password
                </label>
                {formik.errors.password ? (
                  <div style={{ color: "red", fontSize: "1rem" }}>
                    {formik.errors.password}
                  </div>
                ) : null}
              </div>
              <input
                type="password"
                name="password"
                id="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                className={classes.form__password}
              />
            </div>
            <div className={classes.form__control}>
              <div>
                <label
                  htmlFor="passwordConfirm"
                  className={classes.form__label}
                >
                  Confirm Password
                </label>
                {formik.errors.passwordConfirm ? (
                  <div style={{ color: "red", fontSize: "1rem" }}>
                    {formik.errors.passwordConfirm}
                  </div>
                ) : null}
              </div>
              <input
                type="password"
                name="passwordConfirm"
                id="passwordConfirm"
                onChange={formik.handleChange}
                value={formik.values.passwordConfirm}
                className={classes.form__password}
              />
            </div>
            <div className={classes.form__control}>
              <button
                className={`${classes.register__btn} ${
                  state.loading && classes.active
                }`}
              >
                {!state.loading && "Sign Up"}
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
        <h3 style={{ marginTop: "2rem" }}>
          Already have an account? <Link to="/login">Login</Link> here
        </h3>
      </div>

      <div className={classes.register__image}>
        <img
          src="images/loginLogo.svg"
          alt="register"
          className={classes.register__image__1}
        />
      </div>
    </div>
  );
};

export default Register;

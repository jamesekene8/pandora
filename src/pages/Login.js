import React, { useReducer } from "react";
import { Link } from "react-router-dom";
import classes from "./Login.module.css";
import { Button, Spinner } from "react-bootstrap";

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, loading: true };
    default:
      return state;
  }
}

const initialState = {
  loading: false,
};

const Login = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const submitFormHandler = (e) => {
    e.preventDefault();
    dispatch({ type: "login" });
  };

  return (
    <div className={classes.container}>
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
          Dont have an account? <Link to="signup">Sign up</Link> here
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

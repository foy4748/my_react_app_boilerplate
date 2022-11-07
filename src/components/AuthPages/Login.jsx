import { useNavigate, useLocation, Link } from "react-router-dom";
import { useContext, useState } from "react";
import { userContext } from "../../Contexts/AuthContext";
import { Form, Button } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";

import styles from "./Register.module.css";

export default function Login() {
  //Executing Hooks
  const {
    activeUser,
    setActiveUser,
    loginHandler,
    googleLoginHandler,
    githubLoginHandler,
    requestToken,
  } = useContext(userContext);
  const [error, setError] = useState();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirecting if User is Authenticated
  /*
  if (activeUser || activeUser?.uid) {
    navigate(-1);
  }
	*/

  // Event handlers --------------------------

  /* Login Form Submit Handler */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    loginHandler(email, password)
      .then(async ({ user }) => {
        await requestToken(user.uid);
        setActiveUser(user);
        form.reset();
        navigate(location?.state?.from || "/", { replace: true });
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
      });
  };

  /* Google PopUp SignIn Handler */
  const handlerGoogleLogin = () => {
    googleLoginHandler()
      .then(async ({ user }) => {
        await requestToken(user.uid);
        setActiveUser(user);
        navigate(location?.state?.from || "/", { replace: true });
      })
      .catch((error) => setError(error));
  };

  /* Github PopUp SignIn Handler */
  const handlerGithubLogin = () => {
    githubLoginHandler()
      .then(async ({ user }) => {
        await requestToken(user.uid);
        setActiveUser(user);
        navigate(location?.state?.from || "/", { replace: true });
      })
      .catch((error) => setError(error));
  };
  //--------------------------------------------

  return (
    <div className={styles.formContainer}>
      <Form
        onSubmit={(e) => handleSubmit(e)}
        onChange={() => setError(false)}
        className="border rounded p-5"
      >
        <h1 className="text-center">Login</h1>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            required
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <p>
            Don't have an account? Please,{" "}
            <Link
              to="/register"
              state={{ from: location?.state?.from }}
              replace
            >
              Register
            </Link>
          </p>
          {error ? <p style={{ color: "red" }}>"Wrong email/password"</p> : ""}
        </Form.Group>
        <Button className="border readBtn" variant="outline-dark" type="submit">
          Submit
        </Button>
      </Form>
      <hr />
      <h1 className="text-center">Continue using</h1>
      <div className="d-flex justify-content-center">
        <Button
          onClick={handlerGoogleLogin}
          className="border readBtn"
          variant="outline-dark"
          type="submit"
        >
          {" "}
          <FontAwesomeIcon icon={faGoogle} /> Google{" "}
        </Button>
        <Button
          onClick={handlerGithubLogin}
          className="border readBtn"
          variant="outline-dark"
          type="submit"
        >
          {" "}
          <FontAwesomeIcon icon={faGithub} /> Github{" "}
        </Button>
      </div>
    </div>
  );
}

import { useNavigate, useLocation, Link } from "react-router-dom";
import { useContext, useState } from "react";
import { userContext } from "../../Contexts/AuthContext";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import styles from "./Register.module.css";

export default function Register() {
  //Executing Hooks
  const {
    activeUser,
    setActiveUser,
    registerHandler,
    googleLoginHandler,
    githubLoginHandler,
    updateUserProfile,
    requestToken,
  } = useContext(userContext);
  const [error, setError] = useState();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirecting if User is Authenticated
  if (activeUser || activeUser?.uid) {
    navigate(-1);
  }

  // Event handlers --------------------------

  /* Register Form Submit Handler */
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    //Required Fields
    const email = form.email.value;
    const password = form.password.value;

    //Optional Fields
    const displayName = form.displayName.value;
    const photoURL = form.photoURL.value;
    const profileObj = { displayName, photoURL };

    registerHandler(email, password)
      .then(async ({ user }) => {
        await requestToken(user.uid);
        setActiveUser(user);
        form.reset();
        if (displayName && photoURL) {
          handleUpdate(profileObj);
        }
        navigate(location?.state?.from || "/", { replace: true });
      })
      .catch((error) => setError(error));
  };
  // For adding displayName and photoURL
  const handleUpdate = (profileObj) => {
    updateUserProfile(profileObj)
      .then(() => {})
      .catch((error) => console.error(error));
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
        await setActiveUser(user);
        navigate(location?.state?.from || "/", { replace: true });
      })
      .catch((error) => setError(error));
  };
  //--------------------------------------------

  return (
    <div className={styles.formContainer}>
      <Form onSubmit={(e) => handleSubmit(e)} className="border rounded p-5">
        <h1 className="text-center">Register</h1>
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
        <Form.Group className="mb-3" controlId="formBasicFullName">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Full Name"
            name="displayName"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPhotoURL">
          <Form.Label>Photo URL</Form.Label>
          <Form.Control type="text" placeholder="Photo URL" name="photoURL" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <p>
            Already have an account? Please,{" "}
            <Link to="/login" state={{ from: location?.state?.from }} replace>
              Login
            </Link>
          </p>
          {error ? (
            <p style={{ color: "red" }}>"Something Went Wrong. Try again"</p>
          ) : (
            ""
          )}
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
        >
          {" "}
          <FontAwesomeIcon icon={faGoogle} /> Google{" "}
        </Button>
        <Button
          onClick={handlerGithubLogin}
          className="border readBtn"
          variant="outline-dark"
        >
          {" "}
          <FontAwesomeIcon icon={faGithub} /> Github{" "}
        </Button>
      </div>
    </div>
  );
}

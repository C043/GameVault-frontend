import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const RegisterComponent = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [hasError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginFetch = async () => {
    try {
      const resp = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await resp.json();
      if (resp.ok) {
        setError(false);
        setSuccess(true);
        dispatch({ type: "LOGIN", payload: data.token });
        navigate("/home");
      } else throw new Error(data.message);
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      console.log(error);
    }
  };

  const registerFetch = async () => {
    try {
      const resp = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          name: firstName,
          surname: lastName,
          username: username,
          password: password,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await resp.json();
      if (resp.ok) {
        setError(false);
        setSuccess(true);
        dispatch({ type: "USER_ID", payload: data.id });
        loginFetch();
      } else throw new Error(data.message);
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      console.log(error);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    registerFetch();
  };
  return (
    <Form onSubmit={e => handleSubmit(e)}>
      {hasError ? <Alert variant="danger">{errorMessage}</Alert> : ""}
      {success ? <Alert variant="primary">Registration done</Alert> : ""}
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </Form.Group>
      <div className="d-flex">
        <Form.Group className="mb-3" controlId="firstName">
          <div className="d-flex flex-column me-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
          </div>
        </Form.Group>
        <Form.Group className="mb-3" controlId="lastName">
          <div className="d-flex flex-column">
            <Form.Label>Surname</Form.Label>
            <Form.Control
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </div>
        </Form.Group>
      </div>
      <Form.Group className="mb-3" controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default RegisterComponent;

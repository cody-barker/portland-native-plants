import { useState, useContext } from "react";
import { AdminContext } from "../AdminContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
  const { setAdmin } = useContext(AdminContext);
  const [inputState, setInputState] = useState({
    username: "",
    password: "",
  });

  const { username, password } = inputState;

  const onInputChange = (e) => {
    setInputState({
      ...inputState,
      [e.target.name]: e.target.value,
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const formData = {
    username,
    password,
  };

  const showToastMessage = () => {
    toast.success(`Hello, ${username}.`, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then((r) => {
      setIsLoading(false);
      if (r.ok) {
        showToastMessage();
        r.json().then((admin) => setAdmin(admin));
        navigate("/plants");
      } else {
        r.json().then((error) => setErrors(error.errors));
      }
    });
  }

  return (
    <div className="login-container">
      <h3 className="dark-green">Login for Admins Only</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="login-input"
          onChange={onInputChange}
          name="username"
          type="text"
          value={username}
          placeholder="Username"
        ></input>
        <input
          className="login-input"
          onChange={onInputChange}
          name="password"
          type="password"
          value={password}
          placeholder="Password"
        ></input>
        <button type="submit">{isLoading ? "Loading" : "Submit"}</button>
      </form>
      {errors.map((error, index) => (
        <p key={index} className="error-message">
          {error}
        </p>
      ))}
    </div>
  );
}

export default Login;

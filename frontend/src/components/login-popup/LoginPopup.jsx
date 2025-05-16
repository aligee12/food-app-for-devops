import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
// import { toast } from "react-toastify";
const LoginPopup = ({ setShowLogin }) => {
  //
  const { url, setToken } = useContext(StoreContext);
  const [currentState, setCurrentState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  //
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };
  //
  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currentState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    const response = await axios.post(newUrl, data);

    if (response.data.success === "true") {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token); //to save data in browser local storage
      setShowLogin(false);
    } else {
      // toast.error(response.data.message);
      alert(response.data.message);
    }
    console.log(response.data);
  };
  //

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currentState === "Login" ? (
            <></>
          ) : (
            <input
              type="text"
              onChange={onChangeHandler}
              name="name"
              value={data.name}
              placeholder="Your name"
              required
            />
          )}
          <input
            type="email"
            onChange={onChangeHandler}
            name="email"
            value={data.email}
            placeholder="Your email"
            required
          />
          <input
            type="password"
            onChange={onChangeHandler}
            name="password"
            value={data.password}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" formMethod="post">
          {currentState === "Sign Up" ? "Create Account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" id="aggrement" required />
          <label htmlFor="aggrement">
            By continuing, I agree to the <a href="#terms">Terms of Use</a> and{" "}
            <a href="#privacy">Privacy Policy</a>
          </label>
        </div>
        {currentState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrentState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account{" "}
            <span onClick={() => setCurrentState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;

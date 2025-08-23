import "./LoginPopUp.css";
import { useState } from "react";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPopUp = ({ setShowLogin}) => {

    const{backend_url, setToken, setUserId} = useContext(StoreContext);    
  
    const [currState, setCurrState] = useState("login");
    const [showPassword, setShowPassword] = useState(false);

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData({...data, [name]: value})
    }


    const validateEmail = (email) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Basic client-side validation to avoid backend 400s
        const { name, email, password } = data;
        if (!email || !password || (currState === "signup" && !name)) {
            toast.error("Please fill all required fields");
            return;
        }
        if (!validateEmail(email)) {
            toast.error("Please enter a valid email");
            return;
        }
        if (currState === "signup" && password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        let newUrl = backend_url;

            if(currState === "login"){
              newUrl += "/api/user/login";
            }
            else{
              newUrl += "/api/user/register";
            }

        try{
            const response = await axios.post(newUrl, data);
            console.log("Login Response",response.data);
            if(response.data.success){
              setToken(response.data.token);
              setUserId(response.data.userId);
              localStorage.setItem("token", response.data.token);
                setShowLogin(false);

                if(currState === "login"){
                    toast.success(response.data.message || "Logged in successfully");
                }
                else{
                    toast.success(response.data.message || "Registered successfully");
                }
            }
            else{
                toast.error(response.data.message);
            }
        }
        catch(error){
            console.log(error);
            toast.error(error?.response?.data?.message || (currState === "login" ? "Login failed" : "Registration failed"));
        }

    }

    const closeHandler = () => {
        setShowLogin(false);
    }

  return (
    <div className="login-overlay" role="dialog" aria-modal="true">
      <div className="login-modal">
        <header className="login-header">
          <h2 className="login-title">{currState}</h2>
          <button className="login-close" aria-label="Close" onClick={closeHandler}>
            ×
          </button>
        </header>

        <div className="login-body">

          <form onSubmit={handleSubmit} className="login-form">
            
            {
                currState==="login" ? <></> :
                <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={data.name}
                onChange={onChangeHandler}
                required
              />
            </div>
            }

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={data.email}
                onChange={onChangeHandler}
                autoFocus
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="password-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={data.password}
                  onChange={onChangeHandler}
                  required
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className={`actions ${currState}`}>
              <button type="submit" className="btn-primary">{currState === "login" ? "Log in" : "Sign up"}</button>
              {currState === "login" && (
                <div className="switch-auth" aria-live="polite">
                  <span>Don't have an account?</span>
                  <button
                    type="button"
                    className="link-inline"
                    onClick={() => setCurrState("signup")}
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>

           { /* Switch prompt is now inline within actions for login; no extra block needed here */ }
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPopUp;

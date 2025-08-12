import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogo, Envelope, Lock } from "phosphor-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useAuth } from "../../contexts/AuthContext";


export default function Login() {
  const { login, signInWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [formStatus, setFormStatus] = useState("idle");
  const [error, setError] = useState("");

  const emailRef = useRef();
  const passwordRef = useRef();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
  if (currentUser) {
    navigate(`/${currentUser.workspaceURL || "attendance-tracker"}`);
  }
  }, [currentUser, navigate]);


  const handleLogin = async (e) => {
    e.preventDefault();
    setFormStatus("loading");
    setError("");

    try {
      await login(formData.email, formData.password);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to sign in");
    } finally {
      setFormStatus("idle");
    }
  };

  const handleGoogleSignIn = async () => {
    setFormStatus("loading");
    setError("");
    
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(err.message || "Google sign-in failed");
    } finally {
      setFormStatus("idle");
    }
  };

  const togglePasswordVisibility = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="primary flex flex-col min-h-[90vh] px-4">
      <div className="primary flex flex-col justify-center items-center flex-grow  sm:p-6 ">
        <div className=" w-full max-w-sm  py-8 sm:px-6 sm:shadow-sm rounded-lg">
          <div className="text-center mb-6">
            <h1 className="text-color text-xl font-medium mb-2">
              Welcome to Attendance Tracker
            </h1>
            <p className="text-color text-sm text-gray-500">
              To get started, please sign in
            </p>
          </div>

          {/* Google Sign-in Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={formStatus === "loading"}
            className="accent-bg text-white cursor-pointer w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FontAwesomeIcon 
              icon={faGoogle} 
              className=" hover:text-gray-700" 
            />
            <span className=" text-sm">Sign in with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-6 ">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="primary text-color px-3 bg-white text-gray-500 text-sm">or</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Envelope size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  ref={emailRef}
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={formStatus === "loading"}
                  className="primary text-color w-full text-sm pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  placeholder="Enter your email address"
                />
              </div>
              {!isValidEmail && formData.email && (
                <p className="mt-1 text-left text-sm error-text">Please enter a valid email</p>
              )}
            </div>

            {formData.email && (
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={isShowPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    ref={passwordRef}
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={formStatus === "loading"}
                    className="primary text-color w-full text-sm pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FontAwesomeIcon 
                      icon={isShowPassword ? faEyeSlash : faEye} 
                      className="text-color hover:text-gray-700" 
                    />
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-2 bg-red-50 rounded-md">
                <p className="text-sm error-text text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={formStatus === "loading" || !isValidEmail || (formData.email && !formData.password)}
              className="accent-bg w-full py-2 cursor-pointer px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {formStatus === "loading" ? (
                <span className="text-color flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : formData.password ? (
                "Sign In"
              ) : (
                "Continue with Email"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-color">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-medium accent-text  cursor-pointer hover:text-blue-500"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
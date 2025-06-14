/***************/
/**  IMPORTS  **/
/***************/
import { useState, useEffect } from 'react';
import { Form, Button, InputGroup } from "react-bootstrap";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { orbit } from 'ldrs';
import Cookies from "universal-cookie";

/***********************/
/**  AMPLIFY IMPORTS  **/
/***********************/
import { Amplify } from 'aws-amplify';
import amplifyconfig from '../amplifyconfiguration.json';
import { post, get } from 'aws-amplify/api';

/****************************/
/**  LOCAL/ASSETS IMPORTS  **/
/****************************/
import Navbar from "../components/Navbar";
import { useAuth } from '../utils/AuthContext';
import "../App.css";
import { AppFormContainer, 
         FormContainer,
         ErrorMessage } from "../styles/LoginStyles";

/**
 * This component is responsible for displaying the Login Page
 * @returns The Login Page
 */
export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [inputType, setInputType] = useState('password');
    const [loginError, setLoginError] = useState(null);
    const { setUserData } = useAuth(); 

    const cookies = new Cookies();
    const navigate = useNavigate();
    Amplify.configure(amplifyconfig);
    orbit.register();

    /**  HANDLES LOGGING IN  **/
    const handleSubmit = async (e) => {
        setLoginError(null);
        e.preventDefault();
        setLoading(true);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!password && !email) {
            setLoading(false);
            setLoginError("Fields cannot be empty.");
        } else if (!emailRegex.test(email)) {
            setLoading(false);
            setLoginError("Please enter a valid email address.");
        } else if (!password) {
            setLoading(false);
            setLoginError("Password field cannot be empty.");
        } else if (!email) {
            setLoading(false);
            setLoginError("Email field cannot be empty.");
        } else {
            try {
                const loggedIn = post({
                    apiName: 'UserAPI',
                    path: `/user/login`,
                    options: {
                        body: {
                            email,
                            password,
                        }
                    }
                });
    
                const { body } = await loggedIn.response;
                const res = await body.json();
                console.log('Login POST call succeeded');
                cookies.set("TOKEN", res.token, {
                    path: '/',
                })
                setLoading(false);
                localStorage.setItem("EMAIL", email);
                // Handle redirection based on user status
                if (res.status === "Active") {
                    const token = cookies.get("TOKEN");
                    await getUserDetails(token);
                    navigate("/auth/map");  // Active users go to the map page
                } else if (res.status === "Awaiting Approval") {
                    navigate("/awaiting-approval");  // Awaiting approval
                } else if (res.status === "Denied") {
                    navigate("/unauthorized");  // Declined users go to unauthorized
                } else {
                    setLoginError("Login failed: invalid user status.");
                }
    
            } catch (e) {
                console.log('Login POST call failed: ', e);
                setLoading(false);
                setLoginError("Incorrect email or password. Please try again.");
            }
        }
    }

    async function getUserDetails(token){
        try{
            const email = localStorage.getItem("EMAIL");
            const account = get({
                apiName: 'UserAPI',
                    path: `/user/get-user-info?email=${encodeURIComponent(email)}`,
                    options: {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
            });
    
            const { body } = await account.response;
            const res = await body.json();
            console.log("User details GET call succeeded");
            setUserData(res);
        } catch(e){
            console.log('User details GET call failed: ', e);
        }
      }

    // Get token
    const token = cookies.get("TOKEN");

    /**  CHECK IF USER IS LOGGED IN AUTHORIZED  **/
    useEffect(() => {
        if (token) {
            navigate("/auth/map");
        }
    }, [token])

    /**  HANDLES SHOWING THE PASSWORD  **/
    const clickHandler = () => {
        setShowPass((prev) => !prev);
        setInputType(prevType => (prevType === 'password' ? 'text' : 'password'));
      };

    return (
        <>
        <Navbar />
        <AppFormContainer>
            <FormContainer>
                <div className='form-style'> 
                    <h2>Login</h2>
                    <Form>
                        {/* email */}
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control 
                            type="email" 
                            name="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email" />
                        </Form.Group>
                        <br />
                        {/* password */}
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <Form.Control 
                                type={inputType}
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password" />
                                <InputGroup.Text onClick={clickHandler}>
                                {showPass ? <FaEye /> : <FaEyeSlash />}
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <br />

                        {/* submit button */}
                        <div className='button-style'>
                            <Button 
                                variant="primary" 
                                type="submit"
                                onClick={(e) => handleSubmit(e)}>
                                { loading ? 
                                    <l-orbit 
                                        size="30"
                                        speed="1.5"
                                        color="#FFFFFF">
                                    </l-orbit> : "Login" }
                            </Button>
                        </div>
                        {loginError ? (
                            <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                                <ErrorMessage>{loginError}</ErrorMessage>
                            </div>
                        ) : (
                            <></>
                        )}
                    </Form> 
                </div>
                </FormContainer>
        </AppFormContainer>
        </>
    );
}

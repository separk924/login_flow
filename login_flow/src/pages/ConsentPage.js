/***************/
/**  IMPORTS  **/
/***************/
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { orbit } from 'ldrs';
import { toast } from 'react-hot-toast';

/***********************/
/**  AMPLIFY IMPORTS  **/
/***********************/
import { Amplify } from 'aws-amplify';
import amplifyconfig from '../amplifyconfiguration.json';
import { post } from 'aws-amplify/api';

/****************************/
/**  LOCAL/ASSETS IMPORTS  **/
/****************************/
import "../App.css";
import Navbar from "../components/Navbar";
import { FormContainer, 
         AppFormContainer } from "../styles/RegisterStyles";

/**
 * This component is responsible for displaying the Registration Page
 * @returns The Registration Page
 */
export default function Register() {

    const email = localStorage.getItem("EMAIL");
    const [phone_number, setPhoneNumber] = useState("");
    const [isPhoneNumberInvalid, setIsPhoneNumberInvalid] = useState(false);
    const [text_consent, setTextConsent] = useState(false);
    const [email_consent, setEmailConsent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [goToLogin, setGoToLogin] = useState(false);
    const [phoneError, setPhoneError] = useState(null);

    const phonePatternRaw = /^\d{10}$/; // Matches 10 digits (3346634585)
    const phonePatternFormatted = /^\(\d{3}\) \d{3}-\d{4}$/; // Matches (XX) XXX-XXXX
    const phonePatternWithDashes = /^\d{3}-\d{3}-\d{4}$/;

    const navigate = useNavigate();

    Amplify.configure(amplifyconfig);

    orbit.register();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (phone_number && !(phonePatternRaw.test(phone_number) || phonePatternFormatted.test(phone_number) || phonePatternWithDashes.test(phone_number))) {
            setIsPhoneNumberInvalid(true);
            setPhoneError("Must be a valid phone number");
            console.log('Invalid phone');
            return; // Stop the form submission
        } else {
            setIsPhoneNumberInvalid(false); // Reset the state if valid
        }
        setLoading(true);
        try {
            const register = post({
                apiName: 'UserAPI',
                path: '/user/consent',
                options: {
                    body: {
                        email,
                        phone_number,
                        text_consent: text_consent,
                        email_consent: email_consent 
                    }
                }
            });

            const { body } = await register.response;
            const res = await body.json();
            console.log('Registeration POST call succeeded');
            goToLoginHandler();
            toast.success(`Welcome to Project Blue Maps!`, {
                position: 'top-center',
                duration: 5000,
            });
        } catch (e) {
            console.log('Registration POST call failed: ', e);
            setLoading(false);
        }
    }

    /**  HANDLES GOING TO THE WEBSITE  **/
    const goToLoginHandler = async () => {
        navigate("/awaiting-approval");
    }

    const handleTextChanged = (e) => {
        setTextConsent(e.target.checked);
    };

    const handleEmailChanged = (e) => {
        setEmailConsent(e.target.checked);
    };

    const onChangeHandler = (e) => {
        const value = e.target.value;
        setPhoneNumber(value);
        const isValid =
        phonePatternRaw.test(value) ||
        phonePatternFormatted.test(value) ||
        phonePatternWithDashes.test(value);

        setIsPhoneNumberInvalid(!isValid);
        setPhoneError(isValid ? "" : "Must be a valid phone number");
    }

    return (
        <>
        <Navbar />
            <AppFormContainer>
                <FormContainer style={{marginTop: "40px"}}>
                {goToLogin ? (
                        <div className='form-style' style={{textAlign: "center"}}>
                            <h2>Successful Registration!</h2>
                            <p>Our system administrators will verify your account soon. Be on the lookout for an update on your account!</p>
                            <Button 
                            variant="primary" 
                            type="submit"
                            onClick={goToLoginHandler}>
                                Go To Login Page
                            </Button>
                        </div>
                    ) : (
                        <div className='form-style'>
                            <h2>Consent Form</h2>
                            <Form>
                                <br />
                                <div>Do you consent to recieving notifications from Project Blue Map?</div>
                                <br />
                                <Form.Group controlId="formTextConsent">
                                    <Form.Check 
                                    type="checkbox"
                                    label="I agree to recieving text notifications from Project Blue Map from 888-890-7748. Message and data rates may apply. Go to Settings to opt out"
                                    checked={text_consent}
                                    onChange={handleTextChanged} />
                                </Form.Group>
                                <br />
                                <Form.Group controlId="formEmailConsent">
                                    <Form.Check 
                                    type="checkbox"
                                    label="I agree to recieving email notifications from Project Blue Map from projectbluemap@gmail.com. Go to Settings to opt out"
                                    checked={email_consent}
                                    onChange={handleEmailChanged} />
                                </Form.Group>
                                <br />
                                {text_consent ? (
                                    // phone number
                                    <>
                                    <Form.Group controlId="formBasicPhoneNumber">
                                    <Form.Label>Phone Number</Form.Label>
                                        <Form.Control 
                                        type="text"
                                        name="phone_number"
                                        value={phone_number}
                                        onChange={(e) => onChangeHandler(e)}
                                        placeholder="Phone Number"
                                        className="no-arrows"
                                        required
                                        isInvalid={isPhoneNumberInvalid}/>
                                        <Form.Control.Feedback type="invalid">
                                            {phoneError}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <br />
                                    </>
                                ) : (
                                    <></>
                                )}
                                
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
                                                </l-orbit> : "Register" }
                                    </Button>
                                </div>
                            </Form> 
                        </div>
                    )}
                </FormContainer>
            </AppFormContainer>
        </>
    )
}
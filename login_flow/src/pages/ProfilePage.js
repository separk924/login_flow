/***************/
/**  IMPORTS  **/
/***************/
import { useState, useRef, useEffect } from 'react';
import { toast, Toaster, ToastBar } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { orbit, ring } from 'ldrs';
import Cookies from "universal-cookie";

/***********************/
/**  AMPLIFY IMPORTS  **/
/***********************/
import { Amplify } from 'aws-amplify';
import amplifyconfig from '../amplifyconfiguration.json';
import { post } from 'aws-amplify/api';

/****************************/
/**  LOCAL/ASSETS IMPORTS  **/
/****************************/
import { useAuth } from '../utils/AuthContext';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import EditableTextField from "../components/EditableTextField";
import profile_icon from "../assets/profile_icon.svg";
import { PageContainer,
         Header,
         Body,
         BodyContainer,
         ProfilePictureContainer,
         ProfileDetailsContainer,
         Details,
         SaveEditsContainer,
         SaveEditsButton,
         LogoutContainer,
         NavBtnLink
         } from "../styles/ProfileStyles";

export default function Profile({getUserDetails}){

    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    const navigate = useNavigate();

    const inputRef = useRef();
    const [first_name, setFirstName] = useState("");
    const [original_first_name, setOriginalFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [original_last_name, setOriginalLastName] = useState("");
    const [email, setEmail] = useState("");
    const [original_email, setOriginalEmail] = useState("");
    const [number, setNumber] = useState("");
    const [original_number, setOriginalNumber] = useState("");
    const [submitError, setSubmitError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const { userData, setUserData } = useAuth(); 

    orbit.register();
    ring.register();

    Amplify.configure(amplifyconfig);

    useEffect(() => {
        if (userData) {
            setFirstName(userData.first_name || "");
            setOriginalFirstName(userData.first_name || "");
            setLastName(userData.last_name || "");
            setOriginalLastName(userData.last_name || "");
            setEmail(userData.email || "");
            setOriginalEmail(userData.email || "");
            setNumber(userData.phone_number || "");
            setOriginalNumber(userData.phone_number || "");
            setDataLoading(false);
        }
    }, [userData]);

    const changeProfileDetails = async (e) => {
        setLoading(true);
        try{
            const account = post({
                apiName: 'UserAPI',
                    path: '/user/set-profile-info',
                    options: {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: {
                            first_name,
                            last_name,
                            email,
                            number,
                        }
                    }
            });

            const { body } = await account.response;
            const res = await body.json();
            console.log("Changing Profile Details POST call succeeded");

            // Send success notification for profile update
            toast.success(`${res.message}`, {
                position: 'top-center',
                duration: 5000,
            });
            getUserDetails();
            console.log(userData);
            setLoading(false);
        } catch(e){
            setLoading(false);
            console.log('User details GET call failed: ', e);
        }
    }

    /**  LOGOUT FUNCTION  **/
    const logout = () => {
        cookies.remove("TOKEN", { path: '/' });
        localStorage.clear();
        setUserData(null);
        navigate("/");
    };

    return (
        <>
        <Navbar />
        <div style={{display: "flex", justifyContent: "center", flexDirection: "row", backgroundColor: "white", margin: "20px", borderRadius: "10px", paddingBottom: "150px"}}>
            <PageContainer>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <Sidebar></Sidebar>
                    <Header>My Profile</Header>
                </div>
                { !dataLoading ? (
                <div style={{display: "flex", flexDirection: "row"}}>
                    <Body>
                        <BodyContainer>
                            <ProfilePictureContainer lg={12}>
                                <img alt="profile picture" src={profile_icon} style={{height: "70px", marginBottom: "10px"}}></img>
                                Edit Profile Picture
                            </ProfilePictureContainer>
                            <ProfileDetailsContainer md="auto">
                                <div style={{display: "flex", flexDirection: "row", marginTop: "75px"}}>
                                    <Details>
                                        First Name:
                                    </Details>
                                    <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
                                    <EditableTextField
                                            text={first_name}
                                            placeholder="First Name"
                                            childRef={inputRef}
                                            type="input"
                                            style={{width: "100%"}}
                                            setFirstName={setFirstName}
                                            originalValue={original_first_name}
                                            field="first_name"
                                        >
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                name="First Name"
                                                value={first_name}
                                                onChange={e => setFirstName(e.target.value)}
                                                style={{width: "100%"}}
                                            />
                                        </EditableTextField>
                                    </div>
                                </div>
                                <div style={{display: "flex", flexDirection: "row"}}>
                                    <Details>
                                        Last Name:
                                    </Details>
                                    <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
                                        <EditableTextField
                                            text={last_name}
                                            placeholder="Last Name"
                                            childRef={inputRef}
                                            type="input"
                                            style={{width: "100%"}}
                                            originalValue={original_last_name}
                                            setLastName={setLastName}
                                            field="last_name"
                                        >
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                name="Last Name"
                                                value={last_name}
                                                onChange={e => setLastName(e.target.value)}
                                                style={{width: "100%"}}
                                            />
                                        </EditableTextField>
                                    </div>
                                </div>
                                <div style={{display: "flex", flexDirection: "row"}}>
                                    <Details>
                                        Email:
                                    </Details>
                                    <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
                                        <EditableTextField
                                            text={email}
                                            placeholder="Email"
                                            childRef={inputRef}
                                            type="input"
                                            style={{width: "100%"}}
                                            originalValue={original_email}
                                            setEmail={setEmail}
                                            field="email"
                                        >
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                name="Email"
                                                placeholder="Email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                style={{width: "100%", paddingLeft: "5px"}}
                                            />
                                        </EditableTextField>
                                    </div>
                                </div>
                                <div style={{display: "flex", flexDirection: "row"}}>
                                    <Details>
                                        Phone Number:
                                    </Details>
                                    <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
                                        <EditableTextField
                                            text={number}
                                            placeholder="Phone Number"
                                            childRef={inputRef}
                                            type="input"
                                            style={{width: "100%"}}
                                            originalValue={original_number}
                                            setNumber={setNumber}
                                            field="number"
                                        >
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                name="Phone Number"
                                                placeholder="Phone Number"
                                                value={number}
                                                onChange={e => setNumber(e.target.value)}
                                                style={{width: "100%", paddingLeft: "5px"}}
                                            />
                                        </EditableTextField>
                                    </div>
                                </div>
                            </ProfileDetailsContainer>
                            <SaveEditsContainer lg={12}>
                                <SaveEditsButton
                                    onClick={(e) => changeProfileDetails(e)}>
                                    { loading ? 
                                        <l-orbit 
                                            size="30"
                                            speed="1.5"
                                            color="#FFFFFF">
                                        </l-orbit> : "Save Edits" }</SaveEditsButton>
                            </SaveEditsContainer>
                            <LogoutContainer lg={12}>
                                <NavBtnLink
                                    onClick={logout}
                                    to="/">
                                    Logout
                                </NavBtnLink>
                            </LogoutContainer>
                        </BodyContainer>
                    </Body>
                </div>
                ) : (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "40px" }}>
                        <l-ring
                            size="50"
                            stroke="5"
                            bg-opacity="0"
                            speed="2"
                            color="#616161"
                            />
                    </div>
                )}
            </PageContainer>
        </div>
        <Toaster 
      position='top-right'
      toastOptions={{
        className: '',
        style: {
          padding: '16px',
          color: '#205DBC',
          width: '400px',
        },
      }}>{(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== 'loading' && (
                <button 
                onClick={() => toast.dismiss(t.id)}
                style={{border: "none", backgroundColor: "white", color: "#205DBC"}}>
                  X
                </button>
              )}
            </>
          )}
        </ToastBar>
      )}</Toaster>
        </>
    )
}
/**  Profile SVG imported:
 *   https://img.icons8.com/?size=100&id=99268&format=png&color=000000  **/

/***************/
/**  IMPORTS  **/
/***************/
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "universal-cookie";

/***********************/
/**  AMPLIFY IMPORTS  **/
/***********************/
import { Amplify } from 'aws-amplify';
import amplifyconfig from '../amplifyconfiguration.json';
import { get } from 'aws-amplify/api';

/****************************/
/**  LOCAL/ASSETS IMPORTS  **/
/****************************/
import profile from "../assets/profile.png";
import notif from "../assets/notif.png";
import NotificationsOverlay from './NotificationOverlay';
import {
    Nav,
    NavMenu,
    NavBtn,
    NavBtnLink,
    NotifBtnLink,
    NotAvailableBar,
    NotifModal,
    NewNotifMessage,
} from "../styles/NavbarStyles.js";



/**
 * This component is responsible for displaying the Navigation bar at the top of the screen
 * @returns A Navigation bar at the top of the screen
 */
const Navbar = () => {

    const [login, setLogin] = useState(null);
    const [show, setShow] = useState(null);
    const [message, setMessage] = useState("");
    const [redDot, setRedDot] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [isToggled, setToggle] = useState(null);
    const [notifDelete, setNotifDelete] = useState(false);
    const [notifClicked, setNotifClicked] = useState(false);
    const [logoLink, setLogoLink] = useState('');

    const navigate = useNavigate();
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    const email = localStorage.getItem("EMAIL");

    Amplify.configure(amplifyconfig);

    /**  CHECK IF USER IS LOGGED IN/AUTHORIZED  **/
    useEffect(() => {
        if (token) {
            setLogin(token)
        } else {
            setLogin(null)
        }
    }, [token])

    /**  OPEN AND CLOSE NOTIFICATIONS  **/
    const handleOpen = () => {
        setShow(true)
    };
    const handleClose = () => {
        setShow(null)
    };

    const openProfile = () => {
        navigate("/auth/profile");
    };

    async function notifs(){
        // create POST endpoint to get notifications
        try {
            const getNotifications = get({
                apiName: 'NotificationAPI',
                path: `/notification/get-notifications?email=${encodeURIComponent(email)}`,
                options: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            });

            const { body } = await getNotifications.response;
            const res = await body.json();
            console.log('Get notifications GET call succeeded');
            setRedDot(res.show);
            setMessage(res.notifications.reverse());

        } catch (e) {
            console.log('Get notifications GET call failed: ', e);
        }
    }

    /**  HANDLES GETTING ALL NOTIFICATIONS  **/
    useEffect(() => {
        if (token) {
            notifs();
        }
        
    }, [notifClicked, notifDelete]);

    /**  HANDLES EMAIL ALERT TOGGLING  **/
    async function toggle_email() {
        try {
            const email = localStorage.getItem("EMAIL");
            const toggle = get({
                apiName: 'UserAPI',
                path: `/user/email_alerts?email=${encodeURIComponent(email)}`,
                options: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            })

            const { body } = await toggle.response;
            const res = await body.json();
            setToggle(res.email_alerts);
            console.log('Email alerts POST call succeeded');

        } catch (e) {
            console.log('Email alerts POST call failed: ', e);
        }
    }

    /**  MAKES SURE EMAIL ALERT TOGGLING IS CHECKED  **/
    useEffect(() => {
        if(token) {
            toggle_email();
        }
    }, [])

    /**  CHECKS IF CLICKING LOGO SHOULD GO TO LOGIN OR MAP  **/
    useEffect(() => {
        if(token) {
            setLogoLink('/auth/map');
        } else {
            setLogoLink('/');
        }
    }, [token])

    return (
        <>
            <Nav>
                <NavMenu>
                    <a href={logoLink} style={{ textDecoration: 'none', width: "210px", textAlign: "center" }}>
                        <div style={{color: "#205DBC", fontSize: "20px", fontFamily: 'Times New Roman, Times, serif', lineHeight: "25px"}}>
                            <span style={{fontSize: "24px"}}>P</span>ROJECT <span style={{fontSize: "24px"}}>B</span>LUE <span style={{fontSize: "24px"}}>M</span>AP
                        </div>
                    </a>
                </NavMenu>
                {login? (
                    <NavBtn>
                        <NotifBtnLink onClick={handleOpen}>
                            <img className="notif" src={notif} alt="notification" style={{position: 'absolute', transform: 'translateY(30%)', float: "left", width: "15px"}}/>
                            {redDot ? (
                                <div style={{display: "flex", justifyContent: "center", textAlign: "center"}}>
                                    <NewNotifMessage> You Have New Notifications!</NewNotifMessage>
                                    <NotAvailableBar
                                        style={{width: '12px', height: '12px', position: 'static', zIndex: '10', marginTop: '11px', marginRight: "5px", opacity: '90%'}}>
                                    </NotAvailableBar>
                                </div>
                            ) : (
                                <></>
                            )}
                        </NotifBtnLink>
                        <NavBtnLink
                            to="/auth/profile"
                            onClick={openProfile}>
                            <img className="profile" 
                                src={profile} 
                                alt="profile" 
                                style={{color: "white", height: "20px"}}/>
                        </NavBtnLink>
                        {/* {showProfile ? <ProfileButton setShowProfile={setShowProfile}
                                                setLogin={setLogin}
                                                isToggled={isToggled}
                                                setToggle={setToggle}/> : null} */}
                    </NavBtn>
                ) : (
                    <NavBtn>
                        <NavBtnLink to="/sign-up">
                            Sign Up
                        </NavBtnLink>
                    </NavBtn>
                )}
                <NotifModal
                show={show}
                onHide={handleClose}
                scrollable
                fullscreen={"sm-down"}>
                    <NotificationsOverlay 
                        data={message} 
                        notifClicked={notifClicked} 
                        setNotifClicked={setNotifClicked} 
                        notifDelete={notifDelete} 
                        setNotifDelete={setNotifDelete}
                        notifs={notifs}></NotificationsOverlay>
                </NotifModal>
            </Nav>
        </>
    )
};

export default Navbar;

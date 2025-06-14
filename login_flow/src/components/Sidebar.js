/***************/
/**  IMPORTS  **/
/***************/
import React, { useState, useEffect } from 'react';
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
import sidebar_icon from "../assets/sidebar_icon.svg";
import profile_icon from "../assets/profile_icon.svg";
import notification_icon from "../assets/notification_icon.svg";
import settings_icon from "../assets/settings_icon.svg";
import security_icon from "../assets/security_icon.svg";
import close_sidebar_icon from "../assets/close_sidebar_icon.svg";
import admin from "../assets/admin.svg";
import { Container,
         SideBar,
         SidebarIcon,
         CloseSidebar,
         SidebarItems,
         SidebarItem,
         Backdrop } from "../styles/SidebarStyles";

export default function Sidebar() {

    const [open, setOpen] = useState(false);
    const [userData, setUserData] = useState(null);

    Amplify.configure(amplifyconfig);
  
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    async function getUserDetails(){
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

      useEffect(() => {
        getUserDetails();
      }, []);

    return (
        <Container>
            { !open ? (
                <SidebarIcon onClick={handleOpen}>
                    <img alt="sidebar icon" src={sidebar_icon} style={{marginTop: 10}}></img>
                </SidebarIcon>
            ) : (
                <>
                    <Backdrop onClick={handleClose}/>
                    <SideBar>
                        <CloseSidebar onClick={handleClose}>
                            <img alt="close" src={close_sidebar_icon}></img>
                        </CloseSidebar>
                        <SidebarItems>
                            {/* Conditionally render Admin Dashboard only if the user role is admin */}
                            {userData?.role === 'admin' && (
                                <SidebarItem to="/auth/admin">
                                    <img alt="admin icon" src={admin} style={{ marginRight: 20 }}></img>
                                    Admin Dashboard
                                </SidebarItem>
                            )}
                            <SidebarItem to="/auth/profile">
                                <img alt="profile icon" src={profile_icon} style={{marginRight: 20}}></img>
                                Profile
                            </SidebarItem>
                            <SidebarItem to="/auth/notifications">
                                <img alt="notification" src={notification_icon} style={{marginRight: 20}}></img>
                                Notifications
                            </SidebarItem>
                            <SidebarItem to="/auth/settings">
                                <img alt="settings" src={settings_icon} style={{marginRight: 20}}></img>
                                Settings
                            </SidebarItem>
                            <SidebarItem to="/auth/security">
                                <img alt="security" src={security_icon} style={{marginRight: 20}}></img>
                                Security
                            </SidebarItem>
                        </SidebarItems>
                    </SideBar>
                </>
            )}
        </Container>
    )
}
import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

export const Nav = styled.nav`
    background: #FAFAFA;
    height: 85px;
    display: flex;
    justify-content: space-between;
    padding: 0.1rem calc((100vw - 2500px) / 2);
    z-index: 12;
    box-shadow: 0 3px 10px -2px #E3E3E3;
`;
 
export const NavLink = styled(Link)`
    color: #808080;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 .2rem;
    height: 100%;
    cursor: pointer;
    &.active {
        color: #000000;
    }
`;
 
export const NavMenu = styled.div`
    display: flex;
    align-items: center;
    margin-right: -24px;
    margin-left: 10px;
`;
 
export const NavBtn = styled.nav`
    display: flex;
    align-items: center;
    margin-right: 75px;
`;
 
export const NavBtnLink = styled(Link)`
    border-radius: 4px;
    background: #EEEEEE;
    padding: 10px 22px;
    color: #000000;
    outline: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    margin-left: 35px;
    &:hover {
        transition: all 0.2s ease-in-out;
        background: #fff;
        color: #808080;
    }
`;
export const NotifBtnLink = styled(Link)`
    border-radius: 20%;
    background: #EEEEEE;
    padding: 8px 12px;
    padding-bottom: 7px;
    color: #000000;
    outline: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    postion: relative;
    /* Second Nav */
    margin-left: 30px;
    height: 40px;
    width: 40px;
    &:hover {
        transition: all 0.2s ease-in-out;
        background: #fff;
        color: #808080;
    }
`;

export const NotAvailableBar = styled.div`
    background-color: #F11F1F;
    border-radius: 50%;
    height: 15px;
    width: 15px;
    box-shadow: 0 3px 10px -2px #E3E3E3;
    margin-top: 2px;
`;

export const NotifModal = styled(Modal)`
    width: 300px;
    margin-bottom: auto;
    margin-left: auto;
    right: 200px;
    top: 35px;
    font-size: 12px;
    height: 600px;
    @media screen and (max-width: 575px) {
        right: 0px;
        width: auto;
        top: 0px;
        height: 100%;
    }
`;

export const NewNotifMessage = styled.div`
    position: absolute;
    color: #F11F1F;
    font-size: 10px;
    width: 100px;
    margin-right: 120px;
    @media screen and (max-width: 510px) {
        margin-right: 0;
        margin-top: 40px;
    }
`;
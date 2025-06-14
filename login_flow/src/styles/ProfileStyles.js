import styled from "styled-components";
import { Row, Col, NavLink as Link } from "react-bootstrap";

export const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 95%;
`;

export const Header = styled.div`
    padding-top: 15px;
    padding-left: 20px;
    padding-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
    color: #616161;
    display: flex;
    flex-direction: column;
`;

export const Body = styled.div`
    margin-left: 70px;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    width: 100%;
    @media (max-width: 850px) {
        margin: 0;
    }
`;

export const BodyContainer = styled(Row)`
    justify-content: start;
    @media (max-width: 899px) {
        justify-content: center;
    }
`;

export const ProfilePictureContainer = styled(Col)`
    width: 100px;
    height: 100px;
    font-size: 10px;
    text-align: center;
`;

export const ProfileDetailsContainer = styled(Col)`
    height: 80%;
`;

export const Details = styled.div`
    width: 200px;
    display: flex;
    flex-direction: column; 
    margin: 0 0 50px 50px;
    @media (min-width: 767px) {
        margin: 0 0 0 0;
    }
`;

export const SaveEditsContainer = styled(Col)`
    width: 150px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-self: flex-end;
    margin-bottom: -40px;
    @media (min-width: 850px) {
        margin: none;
    }
`;

export const SaveEditsButton = styled.button`
    border-radius: 5px;
    background: #EEEEEE;
    padding: 8px 12px;
    padding-bottom: 7px;
    color: #000000;
    outline: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    height: 40px;
    width: 100px;
    &:hover {
        transition: all 0.2s ease-in-out;
        background: #7d7d7d;
        color: white;
    }
`;

export const LogoutContainer = styled(Col)`
    width: 150px;
    height: 50px;
    margin-bottom: -40px;
    display: flex;
    justify-content: center;
    align-self: flex-end;
    @media (max-width: 1357px) {
        width: 100%;
        margin-top: 50px;
    }
`;

export const NavBtnLink = styled.button`
    width: 100px;
    border-radius: 5px;
    background: #EEEEEE;
    padding: 8px 12px;
    text-align: center;
    color: #000000;
    outline: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    height: 40px;
    &:hover {
        transition: all 0.2s ease-in-out;
        background: #7d7d7d;
        color: white;
    }
    @media (max-width: 1357px) {
        align-self: center;
    }
`;
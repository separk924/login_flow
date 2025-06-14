import styled from "styled-components";
import { NavLink as Link } from 'react-router-dom';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export const SideBar = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 250px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: #f7f7f7;
    justify-content: center;
    display: flex;
    z-index: 14;
`;

export const SidebarIcon = styled.div`
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
        transition: all 0.3s ease-in-out;
        transform: scale(1.2);
    }
`;

export const CloseSidebar = styled.div`
    width: 250px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: end;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
        transition: all 0.3s ease-in-out;
        transform: translateX(-8px);
    }
    position: fixed;
    margin-right: 20px;
`;

export const SidebarItems = styled.div`
    color: #616161;
    width: 250px;
    display: flex;
    flex-direction: column;
    padding: 10px;
    padding-left: 50px;
    margin: auto;
    // position: fixed;
    margin-top: 50px;
    padding-top: 50px;
`;

export const SidebarItem = styled(Link)`
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    margin-bottom: 80px;
    cursor: pointer;
    color: #616161;
    text-decoration: none;
    &:hover {
        transition: all 0.3s ease-in-out;
        transform: scale(1.05);
    }
`;

export const Backdrop = styled.div`
    background-color: rgba(0, 0, 0, 0.15);
    width: 100%;
    height: 100%;
    z-index: 13;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: fixed;
    cursor: pointer;
`;
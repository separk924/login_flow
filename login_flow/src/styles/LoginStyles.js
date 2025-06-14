import styled from "styled-components";

export const AppFormContainer = styled.div`
    display: flex;
    justify-content: center;
`;

export const FormContainer = styled.div`
    display: flex;
    align-items: center;
    width: 450px;
    height: 100%;
    box-shadow: 0 0 15px 3px #E3E3E3;
    justify-content:center;
    background-color: rgb(255, 255, 255);
    margin-top: 70px;
    border-radius: 30px;
    padding: 30px;
`;

export const ErrorMessage = styled.div`
    text-align: center;
    color: #F11F1F;
    width: 200px;
    margin-top: 30px;
    font-size: 12px;
`;
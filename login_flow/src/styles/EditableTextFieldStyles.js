import styled from "styled-components";

export const Editable = styled.div`
    border: 1px solid #d2d2d2;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    height: 30px;
    justify-content: center;
    white-space: nowrap;
`;

export const EditIconContainer = styled.div`
    border-left: 1px solid #d2d2d2;
    border-radius: 0 3px 3px 0;
    position: relative;
    height: auto;
    width: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: white;
`;

export const CancelEdit = styled.div`
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    margin: 5px 0 0 5px;
    height: 20px;
`;

export const SaveEdit = styled.div`
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    margin: 5px 0 0 5px;
    height: 20px;
`;
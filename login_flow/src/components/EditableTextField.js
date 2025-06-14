/***************/
/**  IMPORTS  **/
/***************/
import { useState, useEffect } from 'react';

/***********************/
/**  AMPLIFY IMPORTS  **/
/***********************/

/****************************/
/**  LOCAL/ASSETS IMPORTS  **/
/****************************/
import edit_icon from "../assets/edit_icon.svg";
import edit_icon_fill from "../assets/edit_icon_fill.svg";
import cancel from "../assets/cancel.svg";
import cancel_hover from "../assets/cancel_hover.svg";
import save from "../assets/save.svg";
import save_hover from "../assets/save_hover.svg";
import { Editable,
         EditIconContainer,
         CancelEdit,
         SaveEdit,
 } from '../styles/EditableTextFieldStyles';

/**
 * @typedef {Object} TextFieldProps
 * @property {string} label - The label for the text field.
 * @property {string} [type] - The input type, like 'text', 'password', etc.
 * @property {string} [value] - The current value of the input.
 * @property {function} [onChange] - Function to handle change events.
 * @property {string} [placeholder] - Placeholder text for the input.
 * @property {boolean} [disabled] - Whether the input is disabled.
 * @property {string} [name] - The name of the input.
 * @property {string} [id] - The id of the input.
 * 
 * @param {EditableTextFieldProps} props 
 */
export default function EditableTextField({ text, type, placeholder, children, childRef, setFirstName, setLastName, setEmail, setNumber, originalValue, field, ...props}){

    const [isEditing, setEditing] = useState(false);
    const [editIcon, setEditIcon] = useState(edit_icon);
    const [cancelIcon, setCancelIcon] = useState(cancel);
    const [saveIcon, setSaveIcon] = useState(save);
    const [theText, setText] = useState(text);

    useEffect(() => {
        if(childRef && childRef.current && isEditing){
            childRef.current.focus();
        }
    }, [isEditing, childRef])

    // Event handler while pressing any key while editing
    const handleKeyDown = (e, type) => {
        const { key } = e;
        const keys = ["Escape", "Tab"];
        const enterKey = "Enter";
        const allKeys = [...keys, enterKey];

        if(
            (type === "textarea" && keys.indexOf(key) > -1) ||
            (type !== "textarea" && allKeys.indexOf(key) > -1)){
                setEditing(false);
            }
    };

    const handleSave = () => {
        setText(text);
    };

    const handleCancel = () => {
        if(field === "first_name"){
            setFirstName(originalValue);
            setText(originalValue);
        } else if(field === "last_name"){
            setLastName(originalValue);
            setText(originalValue);
        } else if(field === "email"){
            setEmail(originalValue);
            setText(originalValue);
        } else if(field === "number"){
            setNumber(originalValue);
            setText(originalValue);
        }
    };

    return(
        <section 
            {...props}
            >
            { isEditing ? (
                <div style={{ display: "flex", flexDirection: "row"}}>
                    <Editable
                        onKeyDown={e => handleKeyDown(e, type)}
                    >
                        <div style={{ display: "flex", flexDirection: "row"}}>
                            <div style={{ display: "flex", flexDirection: "column"}}>
                            { children }
                            </div>
                        </div>
                    </Editable>
                    <CancelEdit
                        onMouseOver={() => setCancelIcon(cancel_hover)}
                        onMouseOut={() => setCancelIcon(cancel)}
                        onClick={() => {
                            setCancelIcon(cancel)
                            setEditing(false)
                            handleCancel()}}>
                        <img
                            src={cancelIcon}
                            alt="cancel"
                            style={{height: "20px"}}/>
                    </CancelEdit>
                    <SaveEdit
                        onMouseOver={() => setSaveIcon(save_hover)}
                        onMouseOut={() => setSaveIcon(save)}
                        onClick={() => {
                            setSaveIcon(save)
                            setEditing(false)
                            handleSave()}}>
                        <img
                            src={saveIcon}
                            alt="save"
                            style={{height: "20px"}}/>
                    </SaveEdit>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "row"}}>
                    <Editable>
                        <div style={{ display: "flex", flexDirection: "row"}}>
                            <span style={{width: "100%", paddingLeft: "5px", display: "flex", flexDirection: "column"}}>
                                { theText || placeholder || "Editable content" }
                            </span>
                            <EditIconContainer 
                                onClick={() => {
                                    setEditing(true)
                                    setEditIcon(edit_icon)}}
                                onMouseOver={() => setEditIcon(edit_icon_fill)}
                                onMouseOut={() => setEditIcon(edit_icon)}>
                                <img
                                    src={editIcon}
                                    alt="edit"/>
                            </EditIconContainer>
                        </div>
                    </Editable>
                </div>
            )}
        </section>
    )
}
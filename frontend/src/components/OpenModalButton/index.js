import React from "react"
import { useModal } from "../../context/Modal";

const OpenModalButton = ({ modalComponent, buttonText, onButtonClick, onModalClose, className }) => {
    const { setModalContent, setOnModalClose } = useModal()

    const onClick = () => {
        if (typeof onButtonClick === "function") onButtonClick();
        if (typeof onModalClose === "function") setOnModalClose(onModalClose);
        setModalContent(modalComponent);
    }


    return (
        <button onClick={onClick} className={className}>{buttonText}</button>
    )
}

export default OpenModalButton;

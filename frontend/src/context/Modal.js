
import ReactDOM from "react-dom";
import React, { useRef, useState, useContext } from "react";

import "./Modal.css"

const ModalContext = React.createContext();

export function ModalProvider({ children }) {
    const modalRef = useRef();
    const [modalContent, setModalContent] = useState(null);
    const [onModalClose, setOnModalClose] = useState(null);

    const closeModal = () => {
        setModalContent(null); //clears content of modal
        if (typeof onModalClose === "function") {
            setOnModalClose(null);
            onModalClose();
        }
    }

    const contextValue = {
        modalRef,
        modalContent,
        closeModal,
        setModalContent,
        setOnModalClose,
    };

    return (
        <>
            <ModalContext.Provider value={contextValue}>
                {children}
            </ModalContext.Provider>
            <div ref={modalRef} />
        </>
    );
}


export const Modal = () => {
    const { modalRef, modalContent, closeModal } = useContext(ModalContext);

    if (!modalRef || !modalContent || !modalRef.current) return null;

    return ReactDOM.createPortal(
        <div id="modal">
            <div id="modal-background" onClick={closeModal} />
            <div id="modal-content">{modalContent}</div>
        </div>,
        modalRef.current
    )
}

export const useModal = () => useContext(ModalContext);

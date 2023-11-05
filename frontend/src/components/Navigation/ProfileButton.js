import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

const ProfileButton = ({ user }) => {
    const dispatch = useDispatch();
    const [showMenu, setShowMenue] = useState(false);
    const ulRef = useRef();

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.sessionRemove());
    };

    const openMenu = () => {
        if (showMenu) return;
        setShowMenue(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenue(false);
            }
        };



        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu])

    const dropDownClassName = "profile-dropdown" + (showMenu ? "" : 'hidden');


    return (
        <div>
            <button onClick={() => openMenu()}>
                <i className="fa-regular fa-circle-user"></i>
            </button>
            <ul className={dropDownClassName} ref={ulRef}>
                <li>{user.username}</li>
                <li>{user.firstName} {user.lastName}</li>
                <li>{user.email}</li>
                <li>
                    <button onClick={logout}>Log Out</button>
                </li>
            </ul>
        </div>
    )
}

export default ProfileButton;

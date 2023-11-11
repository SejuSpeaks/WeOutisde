import React, { useState, useEffect, useRef } from "react";
import { Redirect, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

const ProfileButton = ({ user }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [showMenu, setShowMenue] = useState(false);
    const ulRef = useRef();

    const logout = () => {
        // e.preventDefault();
        dispatch(sessionActions.sessionRemove());
        history.push('/')
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
            {/* <button className="profile-button-nav" onClick={openMenu}> */}
            {/* <i className="fa-regular fa-circle-user"></i> */}
            <img className="profile-picture" onClick={openMenu} src="https://img.olympics.com/images/image/private/t_s_w960/t_s_16_9_g_auto/f_auto/primary/jdgk0totpvbrarqpbs09" />
            {/* </button> */}
            <ul className={dropDownClassName} ref={ulRef}>
                <li>{user.username}</li>
                <li>Hello, {user.firstName} {user.lastName}</li>
                <li>Email: {user.email}</li>
                <li>
                    <button onClick={() => history.push('/groups')}>See all Groups</button>
                </li>
                <li>
                    <button onClick={() => history.push('/events')}>View Events</button>
                </li>
                <li>
                    <button onClick={logout}>Log Out</button>
                </li>
            </ul>
        </div>
    )
}

export default ProfileButton;

import { useState } from 'react'
import { setUserThunk } from '../../store/session';
import { useDispatch } from 'react-redux';
import { useHistory, Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import { useSelector } from 'react-redux'

import './LoginForm.css'

const LoginFormPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({})


    const userState = useSelector(state => state.session);
    if (userState.user) {
        return <Redirect to='/' />
    }
    console.log(userState);



    const Submit = (e) => {
        e.preventDefault()

        const user = {
            credential: credential,
            password: password
        }

        dispatch(setUserThunk(user)).catch(
            async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })

    }

    return (
        <div className='login-container'>
            <div className='login-box'>
                <img className='login-page-logo' src='https://cdn.icon-icons.com/icons2/2108/PNG/512/meetup_icon_130877.png' />
                <h2>Log In</h2>
                <form onSubmit={(e) => Submit(e)}>
                    <div className='input-container'>
                        <label htmlFor='username-email'>Username/Email: </label>
                        <input className='text-box-login' type='text' name='username-email' value={credential} onChange={(e) => setCredential(e.target.value)}></input>
                    </div>
                    <div className='input-container'>
                        <label htmlFor='password'>Password: </label>
                        <input className='text-box-login' type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    </div>
                    {errors.credential && <p>{errors.credential}</p>}
                    <button className='login-button' type='submit'>Log In</button>
                </form>

            </div>
        </div>
    )
}

export default LoginFormPage;

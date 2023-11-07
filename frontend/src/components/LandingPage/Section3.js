
import './componentCss/Section3.css'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const Section3 = () => {
    const history = useHistory();
    const user = useSelector(state => state.session.user)

    console.log(user);

    const newGroupClass = "landing-page-links" + (!user ? "disabled" : "")

    return (
        <div className="section3-content-container">
            <div className="see-all-groups-landing-page-container">
                <img src='none'></img>
                <p className='landing-page-links' onClick={() => history.push('/groups')}>See all groups</p>
                <p>Come check out new groups blah blah blah</p>
            </div>

            <div className="find-an-event-landing-page-container">
                <img src='none'></img>
                <p className='landing-page-links'>Find an Event</p>
                <p>Come check out new Events blah blah blah</p>
            </div>

            <div className="start-new-group-landing-page-container">
                <img src='none'></img>
                <p className={newGroupClass}>Start a new group</p>
                <p>Come check out new groups blah blah blah</p>
            </div>

        </div>
    )
}

export default Section3

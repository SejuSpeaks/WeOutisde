
import './componentCss/Section3.css'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import myImage from './images/createnewgroup.png';
import myGroups from './images/seeallgroups.png'
import myEvents from './images/findanevent.png';

const Section3 = () => {
    const history = useHistory();
    const user = useSelector(state => state.session.user)



    const newGroupClass = "landing-page-links" + (!user ? "disabled" : "")
    const startNewGroupDiv = "section3-landing-page-container" + (!user ? "disabled" : "")

    const disableCreateGroups = () => {
        if (newGroupClass === 'landing-page-linksdisabled') {
            return
        }
        else {
            return history.push('/groups/new')
        }
    }

    return (
        <div className="section3-content-container">
            <div className="section3-landing-page-container" onClick={() => history.push('/groups')}>
                <div className='section-3-image-text-container'>
                    <img className='section-3-images' src={myGroups}></img>
                    <p className='landing-page-links' >See all groups</p>
                </div>
                <p>Come check out new groups blah blah blah</p>
            </div>

            <div className="section3-landing-page-container" onClick={() => history.push('/events')}>
                <div className='section-3-image-text-container'>
                    <img className='section-3-images' src={myEvents}></img>
                    <p className='landing-page-links' >Find an Event</p>
                </div>
                <p>Come check out new Events blah blah blah</p>
            </div>

            <div className={startNewGroupDiv}>
                <div className='section-3-image-text-container'>
                    <img className='section-3-images' src={myImage}></img>
                    <p className={newGroupClass} onClick={() => disableCreateGroups()} >Start a group</p>
                </div>
                <p>Come check out new groups blah blah blah</p>
            </div>

        </div>
    )
}

export default Section3

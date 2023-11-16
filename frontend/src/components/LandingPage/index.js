
//components
import Info from './Info';
import Section2 from './Section2';
import Section3 from './Section3';

import './LandingPage.css'

const LandingPage = () => {
    return (
        <div className='landing-page-container'>
            <div className='info-component-container'>
                <Info />
            </div>

            <div className='section-2'>
                <Section2 />
            </div>

            <div>
                <Section3 />
            </div>

            <div className='join-button-landing-page-container'>
                <button className='join-button-landing-page'>Join WeOutside</button>
            </div>
        </div>
    )
}

export default LandingPage;

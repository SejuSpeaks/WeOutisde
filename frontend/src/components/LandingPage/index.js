
//components
import Info from './Info';
import Section2 from './Section2';

import './LandingPage.css'

const LandingPage = () => {
    return (
        <div>
            <div className='info-component-container'>
                <Info />
            </div>
            <div>
                <Section2 />
            </div>
        </div>
    )
}

export default LandingPage;

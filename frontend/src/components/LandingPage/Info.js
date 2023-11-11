
import './componentCss/Info.css'
import myImage from './images/rescale16.png'

const Info = () => {
    return (
        <div className='info-container'>
            <div className='info-text-container'>
                <h2 id='get-out-get-active-slogan'>Get Out Get Active <br />  WeOutside!</h2>
                <p id='landing-page-caption'>Explore the city, discover events, and connect with like-minded people. <br /> Whether you're seeking adventure, culture, or just some good company, <br /> we've got you covered. Join us to make memories and be part of the fun!</p>
            </div>

            <div className='landing-image-container'>
                <img id='landing-page-info-pic' src={myImage} />
            </div>

        </div>
    );
}

export default Info

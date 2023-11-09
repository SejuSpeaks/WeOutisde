import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import './GroupDetailsBlock.css';

const GroupDetailsBlock = ({ group }) => {

    const privacy = group.private ? "Private" : "Public"

    return (
        <>
            <div className="group-details-block-container">

                <div className="group-details-image-container">
                    <Link to='/groups'>groups</Link>
                    <img className='group-details-image' src={group.previewImage} />
                </div>

                <div className="group-details-description-container">
                    <p className='group-show-name '>{group.name}</p>
                    <p className='group-show-city'>{group.city}</p>

                    <div className="group-details-description-container">
                        <span>{group.Events?.length}</span>
                        <label>events</label>
                        <span className="dot">.</span>
                        <span>{privacy}</span>
                        <p>Organized by {group.Organizer.username}</p>
                    </div>

                    <button id='join-group-button'>Join Group</button>
                </div>
            </div>
        </>
    )
}

export default GroupDetailsBlock;

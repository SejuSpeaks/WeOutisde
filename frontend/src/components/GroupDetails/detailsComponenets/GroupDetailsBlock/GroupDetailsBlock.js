import { Link, useHistory, Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import './GroupDetailsBlock.css';
import { useSelector } from 'react-redux';
import OpenModalButton from '../../../OpenModalButton';
import GroupConfirmDelete from '../../../GroupConfirmDelete';

const GroupDetailsBlock = ({ group }) => {
    const history = useHistory();
    const user = useSelector(state => state.session.user)

    const privacy = group.private ? "Private" : "Public"
    const nameOfOrganizer = !group.Organizer.firstName ? group.Organizer.username : `${group.Organizer.firstName}  ${group.Organizer.lastName}`
    const joinGroupClassName = "join-group-button" + (!user || user.id === group.organizerId ? "disable" : "");
    const crudButtonsClass = 'group-details-CRUD' + (user && user.id === group.organizerId ? "" : "disable");

    console.log(joinGroupClassName)

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

                        <div id='dot-container'>
                            <span className="dot">.</span>
                        </div>

                        <span>{privacy}</span>
                        <p>Organized by {nameOfOrganizer}</p>
                    </div>

                    <button onClick={() => alert("Feature coming soon")} id={joinGroupClassName}>Join Group</button>
                    <button className={crudButtonsClass} onClick={() => history.push(`/groups/${group.id}/update`)}>Update</button>
                    <OpenModalButton className={crudButtonsClass} buttonText={"Delete"} modalComponent={<GroupConfirmDelete group={group} />} />
                    <button className={crudButtonsClass} onClick={() => history.push(`/${group.id}/events/new`)}>Create Event</button>
                </div>
            </div>
        </>
    )
}

export default GroupDetailsBlock;

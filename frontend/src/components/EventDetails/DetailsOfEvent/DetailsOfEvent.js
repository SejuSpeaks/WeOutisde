import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getEventById } from "../../../store/events";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import OpenModalButton from "../../OpenModalButton";

import './DetailsOfEvent.css'

//components
import DetailsOfEventHeader from '../DetailsOfEventHeader/DetailsOfEventHeader'
import GroupDetailsBox from "../GroupDetailBox/GroupDetailBox";
import PriceInformation from "../PriceInformationBox/PriceInformation";
import EventDescription from "../EventDescription/EventDescription";
import EventConfirmDelete from "../../EventConfirmDelete";

const DetailsOfEvent = () => {
    const dispatch = useDispatch();
    const { eventId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const event = useSelector(state => state.events[eventId])
    const user = useSelector(state => state.session.user)

    let buttonClassName = 'update-delete-event-buttons' + (!user || !event || !event.Host || user.id !== event.Host.id ? 'disable' : '');


    useEffect(() => {
        console.log('disptching events yippie')
        dispatch(getEventById(eventId))
            .then(() => setIsLoaded(true))
    }, [dispatch, eventId])

    // console.log('checking i am checking', eventPreviewImage);
    //const buttonClassName =


    return (
        <div>
            {isLoaded && (
                <>
                    <div className="event-page-box">
                        <DetailsOfEventHeader event={event} />
                        <div className="event-show-container-event-details">
                            <div>
                                <img className="event-details-img" src={event.previewImage} alt="Event Preview" />
                            </div>

                            <div className="event-and-group-description-box">
                                <GroupDetailsBox event={event} />
                                <PriceInformation event={event} />
                                <button className={buttonClassName}>Update</button>
                                <OpenModalButton className={buttonClassName} buttonText={'Delete'} modalComponent={<EventConfirmDelete event={event} />} />
                            </div>

                        </div>
                        <div>
                            <EventDescription event={event} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );

}

export default DetailsOfEvent;

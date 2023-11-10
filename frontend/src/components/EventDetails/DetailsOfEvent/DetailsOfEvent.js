import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getEventById } from "../../../store/events";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import './DetailsOfEvent.css'

//components
import DetailsOfEventHeader from '../DetailsOfEventHeader/DetailsOfEventHeader'
import GroupDetailsBox from "../GroupDetailBox/GroupDetailBox";
import PriceInformation from "../PriceInformationBox/PriceInformation";
import EventDescription from "../EventDescription/EventDescription";

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
                                <img src={"https://placehold.co/600x400"} alt="Event Preview" />
                            </div>

                            <div className="event-and-group-description-box">
                                <GroupDetailsBox event={event} />
                                <PriceInformation event={event} />
                                <button className={buttonClassName}>Update</button>
                                <button className={buttonClassName}>Delete</button>
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

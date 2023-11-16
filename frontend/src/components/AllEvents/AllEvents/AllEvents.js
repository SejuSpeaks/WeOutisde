import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getAllEvents, clearEvents } from '../../../store/events';


import './AllEvents.css';


//componenets
import AllEventsHeader from '../AllEventsHeader/AllEventsHeader';
import EventsList from '../EventsList/EventsList';



const AllEvents = () => {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);

    //state of events
    const events = useSelector(state => state.events);

    useEffect(() => {
        dispatch(clearEvents())
        dispatch(getAllEvents())
            .then(() => setIsLoaded(true))
    }, [dispatch])

    return (
        <>
            {isLoaded &&
                <div className='all-events-page-container'>
                    <div>
                        < AllEventsHeader />
                    </div>

                    <div>
                        <EventsList events={events} />
                    </div>

                </div>
            }
        </>
    )
}

export default AllEvents;

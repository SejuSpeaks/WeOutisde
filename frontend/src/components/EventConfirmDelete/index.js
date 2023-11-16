import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { deleteEvent } from "../../store/events";

const EventConfirmDelete = ({ event }) => {
    const dispatch = useDispatch();
    const { eventId } = useParams();
    const history = useHistory();
    const { closeModal } = useModal();

    const onSubmit = (e) => {
        e.preventDefault()
        //dispatch thunk
        dispatch(deleteEvent(event.id)).then(closeModal)
            .then(() => history.push(`/groups/${event.Group.id}`))

    }


    return (
        <div>
            <b>Confirm Delete</b>
            <p>Are you sure you want to remove this group? </p>
            <div>
                <button className="group-delete-yes-button" onClick={(e) => onSubmit(e)}>{`Yes (Delete Event)`}</button>
                <button className="group-delete-no-button" onClick={closeModal}>{`No (Keep Event)`}</button>
            </div>
        </div>
    )
}

export default EventConfirmDelete;

import './GCD.css';

import { useModal } from "../../context/Modal";
import { deleteGroup } from "../../store/groups";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const GroupConfirmDelete = ({ group }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();

    const onSubmit = (e) => {
        console.log('uhhh yello?')
        e.preventDefault()
        //dispatch thunk
        dispatch(deleteGroup(group.id)).then(closeModal)
            .then(() => history.push('/groups'))

    }


    return (
        <div>
            <b>Confirm Delete</b>
            <p>Are you sure you want to remove this group? </p>
            <div>
                <button className="group-delete-yes-button" onClick={(e) => onSubmit(e)}>{`Yes (Delete Group)`}</button>
                <button className="group-delete-no-button" onClick={closeModal}>{`No (Keep Group)`}</button>
            </div>
        </div>
    )
}

export default GroupConfirmDelete;

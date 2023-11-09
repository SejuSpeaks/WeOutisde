import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect } from "react";
import { getAllGroups } from "../../../store/groups";
import { useDispatch, useSelector } from "react-redux";

import '../GroupsCss/AllGroups.css'

const AllGroups = () => {
    const dispatch = useDispatch();
    const history = useHistory()
    let groups = useSelector(state => state.groups)

    useEffect(() => {
        dispatch(getAllGroups())
    }, [dispatch])


    const groupInformation = Object.values(groups).map((group) => {

        const privacy = group.private ? "Private" : "Public";

        return (
            <div onClick={() => history.push(`groups/${group.id}`)} key={group.id} className="group-show-container">

                <div className="group-show-image-container">
                    <img src={group.previewImage} />
                </div>

                <div className="group-show-description-container">
                    <b className="group-show-name">{group.name}</b>
                    <p className="group-show-city">{group.city}</p>
                    <p className="group-show-description">{group.about}</p>

                    <div className="group-show-events-container">
                        <p>{privacy}</p>
                        <span className="dot">.</span>
                        <p>{group.Events?.length} </p>
                        <label htmlFor="events">events</label>
                    </div>

                </div>

            </div>
        )
    })

    return (
        <div>
            {groupInformation}
        </div>
    )

}

export default AllGroups;


import { useEffect } from "react";
import { getAllGroups } from "../../../store/groups";
import { useDispatch, useSelector } from "react-redux";


const AllGroups = () => {
    const dispatch = useDispatch();
    let groups = useSelector(state => state.groups)

    useEffect(() => {
        dispatch(getAllGroups())
    }, [dispatch])

    const groupInformation = Object.values(groups).map(group => {
        return (
            <div key={group.id}>
                <p>{group.name}</p>
                <p>{group.city}</p>
                <p>{group.about}</p>

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

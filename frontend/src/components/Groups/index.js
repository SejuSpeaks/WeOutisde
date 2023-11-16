
import './Groups.css'

//components
import GroupHeader from "./GroupComponents/GroupHeader";
import AllGroups from './GroupComponents/AllGroups';

const Groups = () => {
    return (
        <div>
            <div className="group-page-content">
                <div><GroupHeader /></div>
                <div><AllGroups /></div>
            </div>
        </div>
    )
}

export default Groups;

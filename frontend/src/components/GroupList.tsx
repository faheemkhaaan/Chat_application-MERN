

import { useUserActions } from "../context/UserActionsContext";
import useGroupChat from "../hooks/useGroupChat";
import { useAppSelector } from "../store/store";
import { colors } from "../utility/colors";
import GroupCreationForm from "./GroupCreationForm";

function GroupsList() {

    const { groups } = useAppSelector(state => {
        return {
            groups: state.group.groups,
            previews: state.group.groupPreviews,
        }
    });
    const { handleSelectChat } = useUserActions()
    useGroupChat()
    const handleSelectedGroup = (id: string) => {
        handleSelectChat(id, 'group')
    };

    return (


        <div className=" flex-1 py-1 h-[75vh]">
            <GroupCreationForm />
            <ul className="space-y-2">
                {Object.keys(groups).length > 0 ? Object.values(groups).map((group) => {
                    // const preview = Object.values(previews).find(p => p._id === group._id);
                    return (
                        <li

                            onClick={() => handleSelectedGroup(group._id)}
                            key={group._id}
                            className=" rounded-sm p-1 flex gap-2 text-[#1F2937] font-semibold cursor-pointer overflow-hidden relative transition duration-300 hover:shadow-md"
                            style={{ backgroundColor: colors.Isabelline }}

                        >
                            <div className="size-10 border rounded-full overflow-hidden shrink-0 bg-gray-600">
                                <img className="w-full h-full object-cover" src={group.avatar || "/default-profile.png"} alt="" />
                            </div>
                            <p className='px-2 py-1 w-full flex justify-between items-center' >
                                {group?.name?.length > 20 ? group?.name?.substring(0, 17) + "..." : group.name}
                            </p>

                        </li>
                    )
                }) : <p>No Group Found</p>}
            </ul>
        </div>

    )
}
export default GroupsList
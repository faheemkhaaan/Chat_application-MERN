import { FcEndCall } from "react-icons/fc";
import { MdCall } from "react-icons/md";

function CallNotification() {


    return (
        <div className="flex justify-center items-center gap-2">
            <button><FcEndCall size={24} /></button>
            <button><MdCall size={24} /></button>
        </div>
    );
}

export default CallNotification;
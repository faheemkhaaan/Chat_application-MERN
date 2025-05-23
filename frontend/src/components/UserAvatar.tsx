
import { User } from '../types/slice.types'

interface UserAvatarProps {
    user: User;
    size?: 'sm'
}
function UserAvatar({ user }: UserAvatarProps) {
    return (
        <div className='size-10 overflow-hidden rounded-full shrink-0'>
            <img className='w-full h-full object-cover' src={user.picture || "/default-profile.png"} alt="" />
        </div>
    )
}

export default UserAvatar
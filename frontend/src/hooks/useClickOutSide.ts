import { RefObject, useEffect } from "react";

function useClickOutSide(refs: Array<RefObject<HTMLElement | null>>, callBack: () => void, dependencies: any[] = []) {

    useEffect(() => {
        const handleOutSideClick = (event: MouseEvent) => {
            if (refs.every(ref => ref.current && !ref.current.contains(event.target as Node))) {
                callBack()
            }
        };
        document.addEventListener("mousedown", handleOutSideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutSideClick);
        };
    }, [refs, callBack, ...dependencies]);
}

export default useClickOutSide
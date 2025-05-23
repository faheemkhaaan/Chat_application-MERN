import React, { ReactNode, ReactElement, isValidElement } from "react";

function Skeleton({
    pending,
    children,
}: {
    pending: boolean;
    children: ReactNode;
}) {
    const layoutClassRegex =
        /(w-|h-|min-w-|min-h-|max-w-|max-h-|m[trblxy]?-|p[trblxy]?-|gap-|flex|grid|aspect|rounded|space-|place-|items-|justify-|border(-[trblxy]?)?|shadow|z-|overflow|transition)/;

    const transformChildren = (children: ReactNode): ReactNode => {
        return React.Children.map(children, (child) => {
            if (!isValidElement(child)) return child;

            const element = child as ReactElement<any>;

            const originalClassName: string = element.props.className || "";

            // Only keep layout-relevant Tailwind classes
            const layoutClasses = originalClassName
                .split(" ")
                .filter((cls: string) => layoutClassRegex.test(cls))
                .join(" ");

            const skeletonClass = "bg-gray-100 animate-pulse";

            return React.cloneElement(element, {
                ...element.props,
                className: `${layoutClasses} ${skeletonClass}`,
                children: transformChildren(element.props.children),
            });
        });
    };

    return <>{pending ? transformChildren(children) : children}</>;
}

export default Skeleton;

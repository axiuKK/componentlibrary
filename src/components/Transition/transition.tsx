import type { ReactNode } from "react";
import { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import type { CSSTransitionProps } from "react-transition-group/CSSTransition";

type AnimationName = 'zoom-in-top' | 'zoom-in-left' | 'zoom-in-bottom' | 'zoom-in-right'

type TransitionProps = CSSTransitionProps & {
    animation?: AnimationName,
    children?: ReactNode,
};

const Transition = ({
    children,
    classNames,
    animation,
    ...restProps
}: TransitionProps) => {
    //手动提供真实 DOM Ref，让库不再调用 findDOMNode
    const nodeRef = useRef(null);
    return (
        <CSSTransition
            nodeRef={nodeRef}
            classNames={classNames ? classNames : animation}
            {...restProps}
        >
            {children}
        </CSSTransition>
    )
}

export default Transition

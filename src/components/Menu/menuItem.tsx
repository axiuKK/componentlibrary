import classNames from "classnames";

export interface MenuItemProps {
    index: number;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
}

const MenuItem=({
    index,
    disabled=false,
    className='',
    style={},
    children,
}:MenuItemProps)=>{
    const classes=classNames('menu-item',className,{
        'disabled':disabled,
    })

    return(
        <li className={classes} style={style}>
            {children}
        </li>
    )
}

export default MenuItem
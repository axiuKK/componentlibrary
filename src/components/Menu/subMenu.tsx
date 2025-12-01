import classNames from "classnames";
import { useContext } from "react";
import { MenuContext } from "./menu";

export interface SubMenuProps {
    index: number;
    title: string;
    className?: string;
    children: React.ReactNode;
}

const SubMenu = ({
    index = 0,
    title='下拉菜单',
    className = '',
    children,
}: SubMenuProps) => {
    const { index: currentActive } = useContext(MenuContext)
    const classes = classNames('menu-item submenu-item', className, {
        'active': index === currentActive,
    })

    return (
        <li key={index} className={classes}>
            <div className='submenu-title'>
                {title}
            </div>
            {children}
        </li>
    )
}

export default SubMenu
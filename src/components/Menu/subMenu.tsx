import classNames from "classnames";
import { useContext } from "react";
import { MenuContext } from "./menu";
import React from "react";
import type { MenuItemProps } from "./menuItem";

export interface SubMenuProps {
    index?: number;
    title: string;
    className?: string;
    children: React.ReactNode;
}

const SubMenu = ({
    index,
    title = '下拉菜单',
    className = '',
    children,
}: SubMenuProps) => {
    const { index: currentActive } = useContext(MenuContext)
    const classes = classNames('submenu-item', className, {
        'active': index === currentActive,
    })

    const renderChildren = () => {
        return React.Children.map(children, (child, index) => {
            const childElement = child as React.ReactElement<MenuItemProps>
            if (typeof childElement.type === 'function') {
                const type = childElement.type as { displayName?: string }
                if (type.displayName === 'MenuItem') {
                    return React.cloneElement(childElement, {
                        index: index,
                    })
                } else {
                    console.error('子菜单只能包含MenuItem组件')
                    return null
                }
            } else {
                console.error('子菜单只能包含function组件')
                return null
            }
            return child
        })
    }

    return (
        <li key={index} className={classes}>
            <div className='submenu-title'>
                {title}
            </div>

            <ul className="submenu">
                {renderChildren()}
            </ul>
        </li>
    )
}

SubMenu.displayName = 'SubMenu'
export default SubMenu
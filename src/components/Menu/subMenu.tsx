import classNames from "classnames";
import { useContext, useState } from "react";
import { MenuContext } from "./menu";
import React from "react";
import type { MenuItemProps } from "./menuItem";

export interface SubMenuProps {
    index?: string;
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
    const { index: currentActive, mode } = useContext(MenuContext)
    const [menuOpen, setMenuOpen] = useState(false)

    const classes = classNames('submenu', className, {
        'active': index === currentActive,
        'menu-opened': menuOpen,
    })

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setMenuOpen(!menuOpen)
    }
    //处理hover
    let timer: any
    const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
        clearTimeout(timer)
        e.stopPropagation()
        timer = setTimeout(() => {
            setMenuOpen(toggle)
        }, 300)
    }
    //click
    const clickEvents = mode === 'vertical' ? {
        onClick: handleClick,
    } : {}
    //hover
    const mouseEvents = mode !== 'vertical' ? {
        onMouseEnter: (e: React.MouseEvent) => handleMouse(e, true),
        onMouseLeave: (e: React.MouseEvent) => handleMouse(e, false),
    } : {}

    const renderChildren = () => {
        return React.Children.map(children, (child, i) => {
            const childElement = child as React.ReactElement<MenuItemProps>
            if (typeof childElement.type === 'function') {
                const type = childElement.type as { displayName?: string }
                if (type.displayName === 'MenuItem') {
                    return React.cloneElement(childElement, {                       
                        index: `${index}-${i}`,
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
        <li key={index} className='submenu-item' {...mouseEvents}>
            <div className='submenu-title' {...clickEvents}>
                {title}
            </div>

            <ul className={classes}>
                {renderChildren()}
            </ul>
        </li>
    )
}

SubMenu.displayName = 'SubMenu'
export default SubMenu
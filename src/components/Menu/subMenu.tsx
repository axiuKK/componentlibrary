import classNames from "classnames";
import { useContext, useState, useRef } from "react";
import { MenuContext } from "./menu";
import React from "react";
import type { MenuItemProps } from "./menuItem";
import Icon from "../Icon/icon";
import { CSSTransition } from 'react-transition-group'

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
    const { index: currentActive, mode, defaultOpenSubMenus } = useContext(MenuContext)
    //排除未定义的defaultOpenSubMenus
    const opendSubMenus = defaultOpenSubMenus as Array<string>
    //如果是垂直菜单，且默认打开的子菜单包含当前子菜单索引，那么就设置为打开状态
    const isOpend = (index && mode === 'vertical') ? opendSubMenus?.includes(index) : false
    const [menuOpen, setMenuOpen] = useState(isOpend)

    const classes = classNames('submenu', className, {
        'menu-opened': menuOpen,
        'active': index === currentActive,
    })

    const submenuItemclasses = classNames('submenu-item', '', {
        'menu-opened': menuOpen,
        'vertical': mode === 'vertical',
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

    const nodeRef = useRef<HTMLUListElement>(null)
    return (
        <li key={index} className={submenuItemclasses} {...mouseEvents}>
            <div className='submenu-title' {...clickEvents}>
                {title}
                <Icon icon='angle-down' className='arrow-icon' />
            </div>

            <CSSTransition
                in={menuOpen}
                timeout={300}
                classNames='zoom-in-top'
                appear
                nodeRef={nodeRef} 
            >
                <ul ref={nodeRef} className={classes}>
                    {renderChildren()}
                </ul>
            </CSSTransition>
        </li>
    )
}

SubMenu.displayName = 'SubMenu'
export default SubMenu
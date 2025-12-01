import classNames from 'classnames';
import React, { createContext, useState } from 'react'
import type { MenuItemProps } from './menuItem';

type MenuMode = 'horizontal' | 'vertical'

export interface MenuProps {
    //active菜单的索引值
    defaultIndex?: number;
    className?: string;
    mode?: MenuMode;
    style?: React.CSSProperties;
    onSelect?: (index: number) => void;
    children: React.ReactNode;
}

interface IMenuContext {
    index: number;
    onSelect: (index: number) => void;
}

export const MenuContext = createContext<IMenuContext>({
    index: 0,
    onSelect: () => { },
})

const Menu = ({
    defaultIndex = 0,
    className = '',
    mode = 'horizontal',
    style = {},
    onSelect = () => { },
    children,
}: MenuProps) => {
    const [currentActive, setCurrentActive] = useState(defaultIndex)
    const passedContext: IMenuContext = {
        index: currentActive,
        onSelect: (index) => {
            setCurrentActive(index)
            onSelect(index)
            alert(index)
        }
    }

    const classes = classNames('menu', className, {
        'menu-horizontal': mode === 'horizontal',
        'menu-vertical': mode === 'vertical',
    })

    const renderChildren = () => {
        //React.Children 是 React 提供的一个工具对象，专门用来操作组件的 children 属性
        return React.Children.map(children, (child, index) => {
            //child 是一个 React 元素，它的 props 类型是 MenuItemProps
            const childElement = child as React.ReactElement<MenuItemProps>
            //类型保护，判断childElement.type是否为函数组件
            // type 可能是：
            // HTML 标签（'div'、'ul'） → 没有 displayName
            // React 组件（函数组件、class组件） → 有 displayName
            if (typeof childElement.type === 'function') {
                const type = childElement.type as { displayName?: string }
                const displayName = type.displayName
                if (displayName === 'MenuItem') {
                    return child
                } else {
                    console.error('Menu children must be MenuItem')
                    return null
                }
            } else {
                console.error('Menu children must be function component')
                return null
            }
        })
    }

    return (
        <MenuContext.Provider value={passedContext}>
            <ul className={classes} style={style} data-testid="test-menu">
                {renderChildren()}
            </ul>
        </MenuContext.Provider>
    )
}

export default Menu
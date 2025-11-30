import classNames from 'classnames';
import React, { createContext, useState } from 'react'

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

    return (
        <MenuContext.Provider value={passedContext}>
            <ul className={classes} style={style}>
                {children}
            </ul>
        </MenuContext.Provider>
    )
}

export default Menu
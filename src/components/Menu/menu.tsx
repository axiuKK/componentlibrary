import classNames from 'classnames';
import React from 'react'

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

const Menu = ({
    defaultIndex = 0,
    className = '',
    mode = 'horizontal',
    style = {},
    onSelect = () => { },
    children,
}: MenuProps) => {
    const classes = classNames('menu', className, {
        'menu-horizontal': mode === 'horizontal',
        'menu-vertical': mode === 'vertical',
    })

    return (
        <ul className={classes} style={style}>
            {children}
        </ul>
    )
}

export default Menu
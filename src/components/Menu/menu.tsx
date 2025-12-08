import classNames from "classnames";
import React, { useState } from "react";
import type { MenuItemProps } from "./menuItem";
import { MenuContext, type IMenuContext } from "./menuContext";

type MenuMode = "horizontal" | "vertical";

export interface MenuProps {
  //active菜单的索引值
  defaultIndex?: string;
  activeIndex?: string;
  className?: string;
  mode?: MenuMode;
  style?: React.CSSProperties;
  onSelect?: (index: string) => void;
  onChange?: (index: string) => void;
  children: React.ReactNode;
  defaultOpenSubMenus?: string[];
}

const Menu = ({
  defaultIndex = "0",
  activeIndex,
  className = "",
  mode = "horizontal",
  style = {},
  onSelect = () => {},
  onChange = () => {},
  children,
  defaultOpenSubMenus = [],
}: MenuProps) => {
  const isControlled = activeIndex !== undefined;
  const [innerActive, setinnerActive] = useState(defaultIndex);
  const currentActive = isControlled ? activeIndex : innerActive;

  // 处理点击选择
  const handleSelect = (index: string) => {
    if (isControlled) {
      // 受控模式：只通知父组件，不自己改状态
      onChange?.(index);
      onSelect?.(index); // 兼容旧 API
    } else {
      // 非受控模式：自己更新 + 通知
      setinnerActive(index);
      onChange?.(index);
      onSelect?.(index);
    }
  };

  //实际传入的值
  const passedContext: IMenuContext = {
    index: currentActive,
    onSelect: handleSelect,
    mode: mode,
    defaultOpenSubMenus: defaultOpenSubMenus,
  };

  const classes = classNames("menu", className, {
    "menu-horizontal": mode === "horizontal",
    "menu-vertical": mode === "vertical",
  });

  const renderChildren = () => {
    //React.Children 是 React 提供的一个工具对象，专门用来操作组件的 children 属性
    return React.Children.map(children, (child, index) => {
      //child 是一个 React 元素，它的 props 类型是 MenuItemProps
      const childElement = child as React.ReactElement<MenuItemProps>;
      //类型保护，判断childElement.type是否为函数组件
      // type 可能是：
      // HTML 标签（'div'、'ul'） → 没有 displayName
      // React 组件（函数组件、class组件） → 有 displayName
      if (typeof childElement.type === "function") {
        const type = childElement.type as { displayName?: string };
        const displayName = type.displayName;
        if (displayName === "MenuItem" || displayName === "SubMenu") {
          //给menuitem自动添加index属性
          const indexProp = childElement.props.index ?? index;
          return React.cloneElement(childElement, {
            index: indexProp.toString(),
          });
        } else {
          console.error("Menu children must be MenuItem");
          return null;
        }
      } else {
        console.error("Menu children must be function component");
        return null;
      }
    });
  };

  return (
    <MenuContext.Provider value={passedContext}>
      <ul className={classes} style={style} data-testid="test-menu">
        {renderChildren()}
      </ul>
    </MenuContext.Provider>
  );
};

export default Menu;

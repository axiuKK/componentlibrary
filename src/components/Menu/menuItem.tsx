import classNames from "classnames";
import { MenuContext } from "./menu";
import { useContext } from "react";

export interface MenuItemProps {
  index?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const MenuItem = ({
  index,
  disabled = false,
  className = "",
  style = {},
  children,
}: MenuItemProps) => {
  const { index: currentActive, onSelect } = useContext(MenuContext);
  const classes = classNames("menu-item", className, {
    disabled: disabled,
    active: currentActive === index,
  });

  const handleClick = () => {
    if (!disabled) {
      //调用函数，更新active索引值
      if (index !== undefined) {
        onSelect(index);
      }
    }
  };

  return (
    <li className={classes} style={style} onClick={handleClick}>
      {children}
    </li>
  );
};
MenuItem.displayName = "MenuItem";
export default MenuItem;

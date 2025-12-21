import Menu, { type MenuProps } from "./menu";
import MenuItem, { type MenuItemProps } from "./menuItem";
import SubMenu, { type SubMenuProps } from "./subMenu";

// 定义复合组件类型
export interface IMenuComponent extends React.FC<MenuProps> {
  Item: React.FC<MenuItemProps>;
  SubItem: React.FC<SubMenuProps>;
}

const TransMenu = Menu as IMenuComponent;
TransMenu.Item = MenuItem;
TransMenu.SubItem = SubMenu;

export default TransMenu;

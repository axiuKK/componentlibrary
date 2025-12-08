import React from "react";

export type MenuMode = "horizontal" | "vertical";

export interface IMenuContext {
  index: string;
  onSelect: (index: string) => void;
  mode?: MenuMode;
  defaultOpenSubMenus?: string[];
}

export const MenuContext = React.createContext<IMenuContext>({
  index: "0",
  onSelect: () => {},
  mode: "horizontal",
  defaultOpenSubMenus: [],
});

import Menu from "./menu";
import MenuItem from "./menuItem";
import type { Meta, StoryObj } from "@storybook/react";
import SubMenu from "./subMenu";

const menuMeta: Meta<typeof Menu> = {
  title: "menu",
  component: Menu,
  //子组件信息
  subcomponents: {
    Item: MenuItem,
    SubMenu,
  },
  tags: ["autodocs"],
};

export default menuMeta;

type Story = StoryObj<typeof Menu>;

const Template = (args: React.ComponentProps<typeof Menu>) => (
  <Menu {...args}>
    <MenuItem>Default Item</MenuItem>
    <MenuItem>Item 2</MenuItem>
    <MenuItem disabled>Item 3</MenuItem>
    <SubMenu title="Submenu">
      <MenuItem>Submenu Item 1</MenuItem>
      <MenuItem>Submenu Item 2</MenuItem>
    </SubMenu>
  </Menu>
);

export const Default: Story = {
  render: Template,
  args: {
    children: "Default Menu",
  },
};

export const Vertical: Story = {
  render: Template,
  args: {
    children: "Vertical Menu",
    mode: "vertical",
    defaultIndex: "1",
  },
};

export const Controlled: Story = {
  render: Template,
  args: {
    children: "Vertical Menu",
    mode: "vertical",
    defaultIndex: "1",
    activeIndex: "1",
  },
};

import { type Meta, type StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Welcome", // 左侧导航里显示的标题
};

export default meta;

// Story 类型
type Story = StoryObj;

export const ToComponentLibrary: Story = {
  render: () => (
    <div style={{ padding: 20 }}>
      <h1>Welcome to the component library</h1>
      <p>Here you can explore all the components and stories.</p>
    </div>
  ),
};

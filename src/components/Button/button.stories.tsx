import { Button } from './button'
import { type Meta, type StoryObj } from '@storybook/react'

//Meta<组件类型> 定义了组件的元数据，包括标题、组件类型等
const buttonMeta: Meta<typeof Button> = {
    title: 'Button',
    component: Button,
    //启用自动文档
    tags: ['autodocs']
}

export default buttonMeta

//StoryObj<组件类型> 定义了组件的故事对象，包括参数、渲染函数等
type Story = StoryObj<typeof Button>

//模板
const Template = (args: React.ComponentProps<typeof Button>) => (
  <Button {...args} />
)

export const Default: Story = {
  render: Template,
  args: {
    children: 'Default Button',
  },
}

export const Primary: Story = {
  render: Template,
  args: {
    children: 'Primary Button',
    btnType: 'primary',
  },
}

export const Danger: Story = {
  render: Template,
  args: {
    children: 'Danger Button',
    btnType: 'danger',
  },
}

export const Link: Story = {
  render: Template,
  args: {
    children: 'Link Button',
    btnType: 'link',
    href:'www.baidu.com',
  },
}

export const Disabled: Story = {
  render: Template,
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
}

// export const Default: Story = {
//     name: 'Default Button',
//     args: {
//         children: 'Default Button',
//     },
// }

// export const ButtonWithType: Story = {
//     name: 'Button with Type',
//     render: (args) => (
//     <div style={{ display: 'flex', gap: 12 }}>
//       <Button {...args} btnType="primary">Primary Button</Button>
//       <Button {...args} btnType="danger">Danger Button</Button>
//       <Button {...args} btnType="link">Link Button</Button>
//     </div>
//     ),
// }

// export const ButtonWithSize: Story = {
//     name: 'Button with Size',
//     render: (args) => (
//     <div style={{ display: 'flex', gap: 12 }}>
//       <Button {...args} size="lg">Large Button</Button>
//       <Button {...args}>Default Button</Button>
//       <Button {...args} size="sm">Small Button</Button>
//     </div>
//     )
// }

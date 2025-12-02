import { Button } from './button'
import { type Meta, type StoryObj } from '@storybook/react'

//Meta<组件类型> 定义了组件的元数据，包括标题、组件类型等
const buttonMeta: Meta<typeof Button> = {
    title: 'Button',
    component: Button,
}

export default buttonMeta

//StoryObj<组件类型> 定义了组件的故事对象，包括参数、渲染函数等
type Story = StoryObj<typeof Button>

export const Default: Story = {
    name: 'Default Button',
    args: {
        children: 'Default Button',
    },
}

export const ButtonWithType: Story = {
    name: 'Button with Type',
    render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button btnType='primary'>Primary Button</Button>
      <Button btnType='danger'>Danger Button</Button>
      <Button btnType='link'>Link Button</Button>
    </div>
    )
}

export const ButtonWithSize: Story = {
    name: 'Button with Size',
    render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button size='lg'>Large Button</Button>
      <Button>Default Button</Button>
      <Button size='sm'>Small Button</Button>
    </div>
    )
}

import type { Meta, StoryObj } from '@storybook/react';
import Input from './input';

const inputMeta: Meta<typeof Input> = {
  title: 'input',
  component: Input,
  tags: ['autodocs']
}

export default inputMeta

type Story = StoryObj<typeof Input>

const Template = (args: React.ComponentProps<typeof Input>) => (
  <Input {...args} />
)

export const Default: Story = {
  render: Template,
  args: {
    placeholder: 'Default Menu',
  },
}

export const Disabled: Story = {
  render: Template,
  args: {
    placeholder: 'Disabled Menu',
    disabled: true,
  },
}

export const IconInput: Story = {
  args: {
    placeholder: '带图标input',
    icon: 'search',
  },
  render: Template,
}

export const SizeInput: Story = {
  args: {
    placeholder: '带大小的input',
  },
  render: ()=>{
    return(
      <div>
        <Input
          defaultValue="large size"
          size="lg"
        />
        <Input
          placeholder="small size"
          size="sm"
        />
      </div>
    )
  },
}

export const EPandInput: Story = {
  args: {
    placeholder: '带前后缀的input',
  },
  render: () => {
    return (
      <div>
        <Input
          defaultValue="prepend text"
          prepend="https://"
        />
        <Input
          defaultValue="google"
          append=".com"
        />
      </div>
    )
  },
}
import Upload from './upload'
import { type Meta, type StoryObj } from '@storybook/react'

const uploadMeta: Meta<typeof Upload> = {
    title: 'Upload',
        component: Upload,
    //启用自动文档
    tags: ['autodocs']
}

export default uploadMeta

type Story = StoryObj<typeof Upload>

const Template = () => {
    return(
        <Upload
        action='https://jsonplaceholder.typicode.com/posts'
        onProgress={(percentage, file) => {
            console.log(percentage, file);
        }}
        onSuccess={(data, file) => {
            console.log(data, file);
        }}
        onError={(error, file) => {
            console.log(error, file);
        }}
        />
    )
}

export const Default: Story = {
  render: Template,
}
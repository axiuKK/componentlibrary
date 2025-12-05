import Upload from './upload'
import { type Meta, type StoryObj } from '@storybook/react'

const uploadMeta: Meta<typeof Upload> = {
    title: 'Upload',
    component: Upload,
    //启用自动文档
    tags: ['autodocs']
}

const checkFileSize = (file: File) => {
    if (file.size > 1024 * 1024 * 2) {
        console.log('文件大小为:', file.size);
        alert('文件大小不能超过2MB');
        return false;
    } else {
        console.log('此时return true');
        return true;
    }

}
const filePromise = (file: File) => {
    return new Promise<File>((resolve, reject) => {
        if (checkFileSize(file)) {
            resolve(file);
        } else {
            reject(new Error('文件大小超过2MB'));
        }
    })
}

export default uploadMeta

type Story = StoryObj<typeof Upload>

const Template = () => {
    return (
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
            onChange={(file) => {
                console.log(file);
            }}
        />
    )
}

export const Default: Story = {
    render: Template,
}

export const boolBeforeUpload: Story = {
    render: Template,
    args: {
        beforeUpload: checkFileSize,
    }
}

export const asyncBeforeUpload: Story = {
    render: Template,
    args: {
        beforeUpload: filePromise,
    }
}
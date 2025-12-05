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
        alert('文件大小不能超过2MB');
        return false;
    } else {
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

const Template = (args: any) => {
    return (
        <Upload
            {...args}
            action='https://jsonplaceholder.typicode.com/posts'
            onProgress={(percentage) => {
                console.log(percentage);
            }}
            onSuccess={() => {
                console.log('上传成功');
            }}
            onError={() => {
                console.log('上传失败');
            }}
            onChange={() => {
                console.log('文件改变');
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
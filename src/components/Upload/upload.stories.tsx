import Upload from './upload'
import { type Meta, type StoryObj } from '@storybook/react'

const uploadMeta: Meta<typeof Upload> = {
    title: 'Upload',
    component: Upload,
    // 上传组件的宽度
    decorators: [
        (Story) => (
            <div style={{ width: 400 }}>
                <Story />
            </div>
        ),
    ],
    //启用自动文档
    tags: ['autodocs']
}

const defaultFileList = [
    {
        uid: '1',
        size: 1024 * 1024,
        name: 'file1.txt',
        status: 'success',
        percent: 100,
        raw: new File([''], 'file1.txt'),
        response: {
            id: 1,
            name: 'file1.txt',
        },
    },
    {
        uid: '2',
        size: 1024 * 1024,
        name: 'file2.txt',
        status: 'error',
        percent: 50,
        raw: new File([''], 'file2.txt'),
        error: new Error('上传失败'),
    },
    {
        uid: '3',
        size: 1024 * 1024,
        name: 'file3.txt',
        status: 'uploading',
        percent: 75,
        raw: new File([''], 'file3.txt'),
    },
]

const checkFileSize = (file: File) => {
    if (file.size > 1024 * 1024 * 10) {
        alert('文件大小不能超过10MB');
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
            reject(new Error('文件大小超过10MB'));
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
            defaultFileList={defaultFileList}
            name='filename'
            data={{
                token: '123456',
            }}
            headers={{
                'X-Powered-By': 'Bearer 123456',
            }}
            accept='.png'
            multiple={true}
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

//测试进度条，上传较大文件
export const progressUpload: Story = {
    render: Template,
    args: {
        beforeUpload: filePromise,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    }
}
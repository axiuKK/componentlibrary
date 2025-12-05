import axios from 'axios'
import { Button } from '../Button/button'
import { useRef } from 'react'

export interface UploadProps {
    action: string
    beforeUpload?: (file: File) => boolean | Promise<File>
    onProgress?: (percentage: number, file: File) => void
    onSuccess?: (data: any, file: File) => void
    onError?: (error: any, file: File) => void
    onChange?: (file: File) => void
}

const Upload = ({
    action = '/',
    beforeUpload,
    onProgress,
    onSuccess,
    onError,
    onChange,
}: UploadProps,) => {
    const fileInput = useRef<HTMLInputElement>(null)

    const handleClick = () => {
        if (fileInput.current) {
            fileInput.current.click()
        }
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) {
            return
        }
        upLoadFiles(files)
        if (fileInput.current) {
            fileInput.current.value = ''
        }
    }
    const upLoadFiles = (files: FileList) => {
        //把类数组对象 FileList 转换成真正的 Array<File>
        Array.from(files).forEach(file => {
            if (beforeUpload) {
                const result = beforeUpload(file)
                //异步完成后上传
                if (result && result instanceof Promise) {
                    result.then(res => {
                        post(res)
                    }).catch(err => {
                        onError?.(err, file)
                    })
                } else if (result) {
                    post(file)
                }
            }
            //直接上传
            else {
                post(file)
            }
        })
    }
    const post = (file: File) => {
        const formData = new FormData()
        formData.append(file.name, file)
        //并发上传
        axios.post(action, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            //实时监听文件上传进度，并把当前完成百分比通知给组件外部
            onUploadProgress: (e) => {
                // 每次上传有进度变化就会执行
                let percentage = e.total ? Math.round((e.loaded * 100) / e.total) : 0
                //防止与onSuccess冲突，只在进度不是100%时调用onProgress
                if (percentage < 100) {
                    if (onProgress) {
                        onProgress(percentage, file)
                    }
                }
            }
        }).then(res => {
            onSuccess?.(res.data, file)
            onChange?.(file)
        }).catch(err => {
            onError?.(err, file)
            onChange?.(file)
        })
    }

    return (
        <div className="upload-component">
            <Button
                btnType='primary'
                onClick={handleClick}>
                上传文件
            </Button>
            <input
                className='file-input'
                style={{ display: 'none' }}
                ref={fileInput}
                onChange={handleFileChange}
                type='file'
                name='file' />
        </div>
    )
}

export default Upload
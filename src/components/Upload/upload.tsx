import axios from 'axios'
import { Button } from '../Button/button'
import { useRef } from 'react'

export interface UploadProps {
    action: string
    //progressEvent: ProgressEvent 浏览器上传事件对象
    onProgress?: (progressEvent: ProgressEvent, file: File) => void
    onSuccess?: (data: any, file: File) => void
    onError?: (error: any, file: File) => void
}

const Upload = ({
    action = '/',
    onProgress,
    onSuccess,
    onError,
}: UploadProps,) => {
    const fileInput = useRef<HTMLInputElement>(null)

    const handleClick = () => {
        if (fileInput.current) {
            fileInput.current.click()
        }
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
                type='file'
                name='file' />
        </div>
    )
}

export default Upload
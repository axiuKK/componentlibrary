import { type UploadFile } from './upload'
import { Icon } from '../Icon/icon'
import Progress from '../Progress/progress'

interface UpLoadListProps {
    fileList: UploadFile[]
    onRemove: (file: UploadFile) => void
}

const UpLoadlist = ({
    fileList,
    onRemove
}: UpLoadListProps) => {
    return (
        <ul className="upload-list">
            {fileList.map(item => (
                <li className='upload-list-item' key={item.uid}>
                    <span className={`file-name file-name-${item.status}`}>
                        <Icon icon='file-alt' theme='secondary'></Icon>
                        {item.name}
                    </span>
                    <span className='file-status'>
                        {item.status === 'success' && <Icon icon='check-circle' theme='success'></Icon>}
                        {item.status === 'error' && <Icon icon='times-circle' theme='danger'></Icon>}
                        {item.status === 'uploading' && <Icon icon='spinner' spin theme='primary'></Icon>}
                    </span>
                    <span className='file-actions'>
                        <Icon icon='times' theme='info' onClick={() => onRemove(item)}></Icon>
                    </span>
                    {item.status === 'uploading' && (
                        <Progress
                            percent={item.percent || 0}
                        />
                    )}
                </li>
            ))}
        </ul>
    )
}

export default UpLoadlist
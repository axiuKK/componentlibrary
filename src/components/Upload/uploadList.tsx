import { type UploadFile } from './upload'
import { Icon } from '../Icon/icon'

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
                        {item.name}
                        <Icon icon='file-alt' theme='secondary'></Icon>
                    </span>
                    <button onClick={() => onRemove(item)}>删除</button>
                </li>
            ))}
        </ul>
    )
}

export default UpLoadlist
import { useState } from 'react'
import classNames from 'classnames'
import type { ReactNode, DragEvent } from 'react'

interface DraggerProps {
    onFile: (files: FileList) => void;
    children?: ReactNode
}

const Dragger = ({
    onFile,
    children,
}: DraggerProps) => {
    const [dragOver, setDragOver] = useState(false)

    const classes = classNames('uploader-dragger', {
        'is-dragover': dragOver
    })

    const handleDrop = (e: DragEvent<HTMLElement>) => {
        e.preventDefault()
        setDragOver(false)
        onFile(e.dataTransfer.files)
    }
    const handleDrag = (e: DragEvent<HTMLElement>, over: boolean) => {
        e.preventDefault()
        setDragOver(over)
    }
    return (
        <div
            className={classes}
            onDragOver={e => { handleDrag(e, true) }}
            onDragLeave={e => { handleDrag(e, false) }}
            onDrop={handleDrop}
        >
            {children}
        </div>
    )
}

export default Dragger;
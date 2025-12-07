import { useRef, useState } from 'react'
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
    const dragCounter = useRef(0)

    const classes = classNames('uploader-dragger', {
        'is-dragover': dragOver
    })

    const handleDrop = (e: DragEvent<HTMLElement>) => {
        e.preventDefault()
        dragCounter.current = 0
        setDragOver(false)
        onFile(e.dataTransfer.files)
    }
    const handleDragEnter = (e: DragEvent<HTMLElement>) => {
        e.preventDefault()
        dragCounter.current += 1
        setDragOver(true)
    }

    const handleDragLeave = (e: DragEvent<HTMLElement>) => {
        e.preventDefault()
        dragCounter.current -= 1

        if (dragCounter.current === 0) {
            setDragOver(false)
        }
    }

    const handleDragOver = (e: DragEvent<HTMLElement>) => {
        e.preventDefault()
    }

    return (
        <div
            className={classes}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {children}
        </div>
    )
}

export default Dragger;
import { beforeEach, describe, expect, test, vi, type MockedFunction } from 'vitest'
import { fireEvent, render, waitFor, type RenderResult } from '@testing-library/react'
import Upload, { type UploadProps } from '../../../src/components/Upload/upload.js'
import '@testing-library/jest-dom/vitest'
import axios from 'axios'

vi.mock('../Icon/icon', () => {
    return (props: any) => {
        return <span onClick={props.onClick}>{props.icon}</span>
    }
})
vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

const testProps: UploadProps = {
    action: "fakeurl.com",
    onSuccess: vi.fn(),
    onChange: vi.fn(),
    onRemove: vi.fn(),
    drag: true
}

let wrapper: RenderResult, fileInput: HTMLInputElement, uploadArea: HTMLElement

const testFile = new File(['test'], 'test.png', { type: 'image/png' })
describe('Upload', () => {
    beforeEach(() => {
        wrapper = render(<Upload {...testProps}>Click to upload</Upload>)
        fileInput = wrapper.container.querySelector('.file-input') as HTMLInputElement
        uploadArea = wrapper.queryByText('Click to upload') as HTMLElement
    })
    test('renders correctly', async () => {
        const { queryByText } = wrapper
        mockedAxios.post.mockImplementation(() =>
            Promise.resolve({ 'data': 'cool' }))
        expect(uploadArea).toBeInTheDocument()
        expect(fileInput).not.toBeVisible()
        fireEvent.change(fileInput, { target: { files: [testFile] } })
    })
})
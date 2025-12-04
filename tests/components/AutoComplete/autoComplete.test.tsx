import { fireEvent, render, waitFor, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { AutoComplete, type AutoCompleteProps } from '../../../src/components/AutoComplete/autoComplete'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { type RenderResult } from '@testing-library/react'

const testArray = [
    { value: 'ab', number: 11 },
    { value: 'abc', number: 1 },
    { value: 'b', number: 4 },
    { value: 'c', number: 15 },
]

const testProps: AutoCompleteProps = {
    //创建一个立即完成的 Promise，并返回 testArray 作为结果
    fetchSuggestions: async (query) => { return testArray.filter(item => item.value.includes(query)) },
    onSelect: vi.fn(),
    placeholder: 'auto-complete',
}

const renderOption = (item: any) => {
    return (
        <span data-testid={item.value}>
            {item.value}-{item.number}
        </span>
    )
}

let wrapper: RenderResult, inputNode: HTMLInputElement
describe('AutoComplete', () => {
    beforeEach(() => {
        wrapper = render(<AutoComplete {...testProps} />)
        inputNode = wrapper.getByRole('textbox') as HTMLInputElement
    })
    test('test basic render', async () => {
        expect(inputNode).toBeInTheDocument()
        expect(inputNode.placeholder).toBe(testProps.placeholder)
        expect(wrapper.container.querySelector('.suggestion-list')).not.toBeInTheDocument()
        fireEvent.change(inputNode, { target: { value: 'a' } })
        // 等待异步渲染
        await waitFor(() => {
            expect(wrapper.queryByText('ab')).toBeInTheDocument()
            expect(wrapper.queryByText('abc')).toBeInTheDocument()
        })
        expect(wrapper.container.querySelector('.suggestion-list')).toBeInTheDocument()
        const item = await wrapper.findByText('ab')
        fireEvent.click(item)

        expect(testProps.onSelect).toHaveBeenCalledWith({ value: 'ab', number: 11 })
        await waitFor(() => {
            expect(
                wrapper.container.querySelector('.suggestion-list')
            ).not.toBeInTheDocument()
        })
        expect(inputNode.value).toBe('ab')
    })
    test('keyboard support', async () => {
        fireEvent.change(inputNode, { target: { value: 'a' } })
        // 等待异步渲染
        await waitFor(() => {
            expect(wrapper.queryByText('ab')).toBeInTheDocument()
            expect(wrapper.queryByText('abc')).toBeInTheDocument()
        })
        const firstResult = wrapper.queryByText('ab')
        const secondResult = wrapper.queryByText('abc')
        //arrow down
        fireEvent.keyDown(inputNode, { key: 'ArrowDown', code: 'ArrowDown' })
        expect(firstResult).toHaveClass('item-highlighted')
        expect(secondResult).not.toHaveClass('item-highlighted')
        //arrow down
        fireEvent.keyDown(inputNode, { key: 'ArrowDown', code: 'ArrowDown' })
        expect(firstResult).not.toHaveClass('item-highlighted')
        expect(secondResult).toHaveClass('item-highlighted')
        //arrow up
        fireEvent.keyDown(inputNode, { key: 'ArrowUp', code: 'ArrowUp' })
        expect(firstResult).toHaveClass('item-highlighted')
        expect(secondResult).not.toHaveClass('item-highlighted')
        //enter
        fireEvent.keyDown(inputNode, { key: 'Enter', code: 'Enter' })
        expect(testProps.onSelect).toHaveBeenCalledWith({ value: 'ab', number: 11 })
        await waitFor(() => {
            expect(
                wrapper.container.querySelector('.suggestion-list')
            ).not.toBeInTheDocument()
        })
    })
    test('click outside should hide suggestions', async () => {
        fireEvent.change(inputNode, { target: { value: 'a' } })
        // 等待异步渲染
        await waitFor(() => {
            expect(wrapper.queryByText('ab')).toBeInTheDocument()
            expect(wrapper.queryByText('abc')).toBeInTheDocument()
        })
        //点击外部
        fireEvent.click(document.body)
        await waitFor(() => {
            expect(
                wrapper.container.querySelector('.suggestion-list')
            ).not.toBeInTheDocument()
        })
    })
    test('renderOptions by self', async () => {
        cleanup()
        wrapper = render(<AutoComplete renderOption={renderOption} {...testProps} />)
        inputNode = wrapper.getByRole('textbox') as HTMLInputElement
        fireEvent.change(inputNode, { target: { value: 'a' } })
        // 等待异步渲染
        await waitFor(() => {
            expect(wrapper.queryByText('ab-11')).toBeInTheDocument()
            expect(wrapper.queryByText('abc-1')).toBeInTheDocument()
        })
    })
})


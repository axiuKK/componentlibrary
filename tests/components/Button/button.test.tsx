import { describe,expect, test } from 'vitest'
import { render } from '@testing-library/react'
import Button from '../../../src/components/Button/button.js'
import '@testing-library/jest-dom/vitest'

describe('Button 组件', () => {
  test('default button', () => {
    const { getByText } = render(<Button>点击我</Button>)
    const btn = getByText('点击我')
    expect(btn).toBeTruthy()  // 检查是否渲染了 children
    expect(btn).toBeInTheDocument()  // 检查是否在文档中
    expect(btn.tagName).toBe('BUTTON')  // 检查标签名是否为 button
    expect(btn).toHaveClass('btn btn-default')  // 检查默认类名
  })
  test('button with different props', () => {
  })
  test('link button & href', () => {
  })
  test('disabled button', () => {
  })
})

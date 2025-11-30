import { expect, test } from 'vitest'
import { render } from '@testing-library/react'
import Button from '../../../src/components/Button/button.js'
import '@testing-library/jest-dom/vitest'

test('Button 渲染 children', () => {
  const { getByText } = render(<Button>点击我</Button>)
  const btn = getByText('点击我')
  expect(btn).toBeTruthy()  // 检查是否渲染了 children
  expect(btn).toBeInTheDocument()  // 检查是否在文档中
})

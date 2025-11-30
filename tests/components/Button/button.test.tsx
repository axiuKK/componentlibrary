import { describe, expect, test, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import Button, { ButtonProps } from '../../../src/components/Button/button.js'
import '@testing-library/jest-dom/vitest'

const defaultProps = {
  //moock函数，模拟点击事件
  onClick: vi.fn()
}

const testProps: ButtonProps = {
  btnType: 'primary',
  size: 'lg',
  className: 'klass',
  children: 'props测试按钮',
}

const disabledProps: ButtonProps = {
  btnType: 'link',
  size: 'sm',
  disabled: true,
  className: 'klass',
  children: 'disabled测试按钮',
}

describe('Button 组件', () => {
  test('default button', () => {
    const { getByText } = render(<Button>默认值</Button>)
    const btn = getByText('默认值')
    expect(btn).toBeTruthy()  // 检查是否渲染了 children
    expect(btn).toBeInTheDocument()  // 检查是否在文档中
    expect(btn.tagName).toBe('BUTTON')  // 检查标签名是否为 button
    expect(btn).toHaveClass('btn btn-default')  // 检查默认类名
    expect(btn).not.toBeDisabled()
  })
  test('click button', () => {
    const { getByText } = render(<Button {...defaultProps}>点击我</Button>)
    const btn = getByText('点击我')
    btn.click()
    expect(btn.tagName).toBe('BUTTON')
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1)
  })
  test('button with different props', () => {
    const { getByText } = render(<Button {...testProps}>不同属性值</Button>)
    const btn = getByText('不同属性值')
    expect(btn.tagName).toBe('BUTTON')
    expect(btn).toHaveClass('btn btn-primary btn-lg klass')
  })
  test('link button & href', () => {
    const { getByText } = render(<Button btnType="link" href="https://www.baidu.com">链接按钮</Button>)
    const btn = getByText('链接按钮')
    expect(btn.tagName).toBe('A')
    expect(btn).toHaveClass('btn btn-link')
    expect(btn).toHaveAttribute('href', 'https://www.baidu.com')
  })
  test('disabled button', () => {
    const { getByText } = render(<Button {...disabledProps}>disabled按钮</Button>)
    const btn = getByText('disabled按钮')
    expect(btn.tagName).toBe('BUTTON')
    expect(btn).toHaveClass('btn btn-link btn-sm klass')
    expect(btn).toBeDisabled()
    fireEvent.click(btn)
    expect(defaultProps.onClick).not.toHaveBeenCalledTimes(0)
  })
})

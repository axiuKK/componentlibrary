import { beforeEach, describe, expect, test, vi } from 'vitest'
import { render, RenderResult } from '@testing-library/react'
import Menu from '../../../src/components/Menu/menu'
import MenuItem from '../../../src/components/Menu/menuItem'
import '@testing-library/jest-dom/vitest'
import { MenuProps } from '../../../src/components/Menu/menu'

const defaultProps: MenuProps = {
  defaultIndex: 0,
  //模拟点击函数，用于测试点击事件是否触发
  onSelect: vi.fn(),
  className: 'test',
  children: <>test</>,
}
const VerticalProps: MenuProps = {
  defaultIndex: 0,
  mode: 'vertical',
  children: <>test</>,
}

const generateMenu = (props: MenuProps) => {
  return (
    <Menu {...props}>
      <MenuItem index={0} active>
        active
      </MenuItem>
      <MenuItem index={1} disabled>
        disabled
      </MenuItem>
      <MenuItem index={2}>
        xyz
      </MenuItem>
    </Menu>
  )
}

let wrapper: RenderResult, menuElement: HTMLElement, activeElement: HTMLElement, disabledElement: HTMLElement

describe('Menu 组件', () => {
  beforeEach(() => {
    // 每个测试用例运行前执行
    wrapper = render(generateMenu(defaultProps))
    //拿到被标记 data-testid="test-menu" 的 DOM 元素(即<ul>)
    menuElement = wrapper.getByTestId('test-menu')
    activeElement = wrapper.getByText('active')
    disabledElement = wrapper.getByText('disabled')
  })

  test('default menu', () => {
    expect(menuElement).toBeTruthy()  // 检查是否渲染了 children
    expect(menuElement).toBeInTheDocument()  // 检查是否在文档中
    expect(menuElement.tagName).toBe('UL')  // 检查标签名是否为 ul
    expect(menuElement).toHaveClass('menu test')  // 检查默认类名
    expect(menuElement.getElementsByTagName('li').length).toBe(3)  // 检查是否渲染了 3 个 li
    //menuItem组件，className=menu-item
    expect(activeElement).toHaveClass('menu-item active')  // 检查默认类名
    expect(disabledElement).toHaveClass('menu-item disabled')  // 检查默认类名
  })
  test('click menu item', () => {
    //点击xyz菜单项
    const thirdItem = wrapper.getByText('xyz')
    thirdItem.click()
    //检查是否触发了onSelect函数
    expect(defaultProps.onSelect).toHaveBeenCalledWith(2)
    expect(thirdItem).toHaveClass('menu-item active')  // 检查是否添加了 active 类名
    expect(activeElement).not.toHaveClass('active')  // 检查 active 类名是否从 active 移除
  })
  test('vertical menu', () => {

  })
})
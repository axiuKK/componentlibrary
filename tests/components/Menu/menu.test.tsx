import { beforeEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render, RenderResult, waitFor } from '@testing-library/react'
import Menu from '../../../src/components/Menu/menu'
import MenuItem from '../../../src/components/Menu/menuItem'
import '@testing-library/jest-dom/vitest'
import { MenuProps } from '../../../src/components/Menu/menu'
import Button from '../../../src/components/Button/button'
import SubMenu from '../../../src/components/Menu/subMenu'

const defaultProps: MenuProps = {
  //index=0，默认选中第一个菜单项
  defaultIndex: '0',
  //模拟点击函数，用于测试点击事件是否触发
  onSelect: vi.fn(),
  className: 'test',
  children: <MenuItem index="0">test</MenuItem>,
}
const VerticalProps: MenuProps = {
  defaultIndex: '0',
  mode: 'vertical',
  children: <MenuItem index="0">test</MenuItem>,
}

const generateMenu = (props: MenuProps) => {
  return (
    <Menu {...props}>
      //index="0",默认选中第一个菜单项,所以为active
      <MenuItem index="0">
        active
      </MenuItem>
      <MenuItem index="1" disabled>
        disabled
      </MenuItem>
      <MenuItem index="2">
        xyz
      </MenuItem>
      <SubMenu title="下拉菜单">
        <MenuItem>子项1</MenuItem>
        <MenuItem>子项2</MenuItem>
      </SubMenu>
    </Menu>
  )
}

const wrongMenu = (props: MenuProps) => {
  return (
    <Menu {...props}>
      //index="0",默认选中第一个菜单项,所以为active
      <MenuItem index="0">
        active
      </MenuItem>
      <MenuItem index="1" disabled>
        disabled
      </MenuItem>
      <MenuItem index="2">
        xyz
      </MenuItem>
      <li>123</li>//HTML
      <Button>默认按钮</Button>//不是menuItem组件
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
    //expect(menuElement.getElementsByTagName('li').length).toBe(3)  // 检查是否渲染了 3 个 li

    //scope选择当前元素的 直接子元素，而不是所有后代元素
    expect(menuElement.querySelectorAll(':scope > li').length).toBe(4)  // 检查是否渲染了 4 个 li
    //menuItem组件，className=menu-item
    expect(activeElement).toHaveClass('menu-item active')  // 检查默认类名
    expect(disabledElement).toHaveClass('menu-item disabled')  // 检查默认类名
  })
  test('click menu item', async () => {
    const item = wrapper.getByText('xyz')
    item.click()
    //onSelect函数被调用，传入的参数index为'2'
    expect(defaultProps.onSelect).toHaveBeenCalledWith('2')
    expect(defaultProps.onSelect).not.toHaveBeenCalledWith('0')

    //waitFor 会循环检查 DOM 更新，直到满足条件
    await waitFor(() => {
      expect(wrapper.getByText('xyz')).toHaveClass('active')
      expect(activeElement).not.toHaveClass('active')  // 检查 active 类名是否从 active 移除
    })

  })
  test('vertical menu', () => {
    //清除wrapper渲染的defaultProps，里面也有test-menu所以查找到多个
    cleanup()
    const verticalWrapper = render(generateMenu(VerticalProps))
    const verticalMenuElement = verticalWrapper.getByTestId('test-menu')
    expect(verticalMenuElement).toHaveClass('menu-vertical')  // 检查默认类名
  })
  test('wrong children', () => {
    cleanup()
    const spy = vi.spyOn(console, 'error')//监听console函数
    const wrongWrapper = render(wrongMenu(defaultProps))
    const wrongMenuElement = wrongWrapper.getByTestId('test-menu')
    expect(wrongMenuElement).toBeTruthy()  // 检查是否渲染了 children
    //li被过滤，只渲染menuItem
    expect(wrongMenuElement.getElementsByTagName('li').length).toBe(3)

    expect(spy).toHaveBeenCalledWith('Menu children must be function component')
    expect(spy).toHaveBeenCalledWith('Menu children must be MenuItem')
    //恢复原函数，也就是撤销 spy 的监听
    spy.mockRestore()
  })
})
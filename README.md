# React + TypeScript + Vite

## CSS

Sass 是 CSS 的增强版：

- 可以用 **变量**：方便统一管理颜色、字体、间距等
- 可以用 **嵌套**：CSS 层级关系更清晰
- 可以用 **mixin 和函数**：复用样式或做计算
- 支持 **模块化**：通过 `@use` 或 `@import` 分文件管理样式

![image-20251130115641042](assets/image-20251130115641042.png)

1️⃣ `_reboot.scss`

- 作用：重置或统一浏览器默认样式
- 解释：不同浏览器对 HTML 元素有默认样式（比如 `h1`、`p`、`button`），会导致界面显示不一致
- `_reboot.scss` 会把这些默认样式统一
- `_` 前缀说明：这是一个 **局部文件，不直接编译成 CSS**，只被其他 `.scss` 文件导入使用

2️⃣ `_variables.scss`

- 作用：定义全局样式变量
- 解释：为了方便管理颜色、字体、间距等样式，可以把它们放在变量里
- 例子：

3️⃣ `index.scss`

- 作用：汇总、引入所有子样式，并最终被项目引用
- 解释：就像一个“总入口”，把 `_reboot.scss`、`_variables.scss` 等文件整合起来

## 第一个组件Button

![alt text](image.png)

最终实现

![image-20251130205704621](assets/image-20251130205704621.png)

### 安装class Names

根据条件自动拼 class Name

```js
npm install classnames
```

用法：根据你给按钮的配置，决定要加哪些 CSS 类名

```js
classNames(
  固定class,
  可选class,
  {
    "class-名字": 条件,
    "class-名字": 条件
  }
)
```

条件为 **true** → 加这个 class
条件为 **false** → 不加

最终效果：

```js
<button class="btn btn-primary btn-lg disabled"></button>
```

### React Button 组件整体流程总结

1️⃣ 明确需求和功能

先想清楚按钮要实现什么功能：

- 可以有不同类型（primary / default / danger / link）
- 可以有不同尺寸（lg / sm）
- 可以禁用（disabled）
- 可以是普通按钮 `<button>` 或链接 `<a>`
- 可以自定义样式（className）
- 支持子内容（children）

------

2️⃣ 定义类型（TypeScript）

用 TS 规定组件的 Props 类型，保证传参安全：

```js
export type ButtonSize = 'lg' | 'sm'
export type ButtonType = 'primary' | 'default' | 'danger' | 'link'

interface BaseButtonProps {
  className?: string
  disabled?: boolean
  size?: ButtonSize
  btnType?: ButtonType
  children: React.ReactNode
  href?: string
}
```

- **children** → 按钮内容
- **btnType** → 按钮类型
- **size** → 按钮大小
- **disabled** → 是否禁用
- **href** → 链接按钮地址
- **className** → 用户自定义样式

------

3️⃣ 拼 className 样式

用 `classnames` 根据条件拼接 class：

```js
const classes = classNames('btn', className, {
  [`btn-${btnType}`]: btnType,
  [`btn-${size}`]: size,
  'disabled': btnType === 'link' && disabled
})
```

- `btn` → 基础样式
- `btn-${btnType}` → 类型样式
- `btn-${size}` → 尺寸样式
- `disabled` → 链接禁用样式
- 支持额外 `className`

------

4️⃣ 判断渲染哪种 HTML 标签+设置默认值

```js
if (btnType === 'link' && href) {
  // 链接按钮
  return <a className={classes} href={href} {...restProps}>{children}</a>
} else {
  // 普通按钮
  return <button className={classes} disabled={disabled} {...restProps}>{children}</button>
}
```

- **`<a>`** → btnType=link + href
- **`<button>`** → 其他情况
- `{...restProps}` → 支持额外属性（onClick、target 等）

测试发现这样定义会失效，所以直接传入默认值

```js
/*// 给 props 设置默认值
// 当用户使用组件时，没有传某个 prop，就用这里设置的默认值
Button.defaultProps = {
  btnType: 'default',
  size: 'sm',
  disabled: false,
}*/

//对BaseButtonProps解构props
export const Button = ({
  btnType='default',
  className,
  disabled=false,
  size='sm',
  children,
  href,
  ...restProps
}: ButtonProps) => {
```

5️⃣ 完整组件框架

```js
import React from 'react'
import classNames from 'classnames'

export const Button = ({
  btnType='default',
  className,
  disabled=false,
  size='sm',
  children,
  href,
  ...restProps
}: BaseButtonProps) => {
  const classes = classNames('btn', className, {
    [`btn-${btnType}`]: btnType,
    [`btn-${size}`]: size,
    'disabled': btnType === 'link' && disabled
  })

  if (btnType === 'link' && href) {
    return (
      <a className={classes} href={href} {...restProps}>
        {children}
      </a>
    )
  } else {
    return (
      <button className={classes} disabled={disabled} {...restProps}>
        {children}
      </button>
    )
  }
}

// 给 props 设置默认值
// 当用户使用组件时，没有传某个 prop，就用这里设置的默认值
Button.defaultProps = {
  btnType: 'default',
  size: 'sm',
  disabled: false,
}

export default Button
```

------

6️⃣ 使用方法示例

```js
<Button>默认按钮</Button>
<Button btnType="primary">主按钮</Button>
<Button btnType="danger" size="lg">大红按钮</Button>
<Button btnType="link" href="https://example.com">链接按钮</Button>
<Button btnType="link" href="https://example.com" disabled>禁用链接</Button>
```

------

7️⃣ 总结流程思路

1. **分析功能需求** → 类型、状态、特殊情况
2. **定义 TS 类型** → 保证 props 安全
3. **拼接 className** → 模块化、条件化样式
4. **判断渲染标签** → `<button>` 或 `<a>`
5. **透传剩余 props** → 支持 onClick、target 等
6. **返回 JSX** → 子内容(children) 渲染
7. **在项目里使用** → 根据 props 控制样式和行为

### 继承原生属性

方法一：联合类型（Union Type）

```
type ButtonProps = ButtonHTMLProps | AnchorHTMLProps;
```

- 解释：这个 ButtonProps **可能是按钮属性，也可能是链接属性**
- 缺点：访问属性时 TypeScript 可能不确定类型，需要做类型判断

------

方法二：交叉类型（Intersection Type） —— 更常用

```
type ButtonProps = CustomProps & Partial<ButtonHTMLProps & AnchorHTMLProps>;
```

- `&` 表示 **交叉类型**（Intersection）
- 意思：ButtonProps **同时包含**：
  - 自定义属性（btnType、size、href 等）
  - 原生按钮属性
  - 原生链接属性（用 Partial 包裹表示可选）
- 优点：使用 `...restProps` 时，TS 能智能提示所有属性，不需要额外判断

> 总结：
>
> - 联合类型（`|`） = 多种可能，某一时刻只能是其中一种
> - 交叉类型（`&`） = 多种类型叠加，同时拥有
> - 组件里用交叉类型更合适，因为我们希望自定义属性和原生属性 **都能用**

`Partial<T>` 是 TypeScript 的一个 **工具类型（Utility Type）**，作用是：

> 把类型 `T` 里的 **所有属性都变为可选（optional）**

交叉类型，包含 `<button>` 和 `<a>` 的所有原生属性

如果不加 `Partial`：

- 会报错，因为交叉类型里所有原生属性都是必填
- 加 `Partial` 后，原生属性 **都变为可选**，你只传 `onClick` 或 `type` 就可以了

## 测试

安装vitest

```js
npm install -D vitest
```

```js
//package.json
{
  "scripts": {
    "test": "vitest"
  }
}
```

安装testing-library

```js
npm install --save-dev @testing-library/react @testing-library/jest-dom jsdom
```

配置enviroment，这是vite.config.ts

```js
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,          // 可以直接使用 test/expect
    environment: "jsdom",   // 模拟浏览器环境
  }
})
```

安装jest-dom

```js
npm install --save-dev @testing-library/jest-dom
```

## Menu导航组件

![image-20251130205634188](assets/image-20251130205634188.png)

分为Menu和MenuItem两个组件

### context

要将Menu的props传入MenuItem，使用hook

 Context

- 是 React 自带的 API（`createContext` + `useContext`）。
- 适合组件树中少量状态共享，例如：菜单的选中项、主题色、语言切换等。
- 状态通常由父组件管理（这里的 `Menu`），然后通过 Context 传给子组件。
- 使用简单，不需要额外依赖。

### 测试

#### 发现active没有渲染到className中

active为异步渲染

1、你点击 MenuItem：

```
const thirdItem = wrapper.getByText('xyz')
thirdItem.click()
```

2、MenuItem 内部会调用 `onSelect(index)`：

```
const handleClick = () => {
  if (!disabled) onSelect(index)
}
```

3、Menu 组件里 `onSelect` 更新 state：

```
setCurrentActive(index) // React 异步更新
```

4、React state 更新是 **异步的**，下一轮渲染（re-render）才会触发 MenuItem class 更新：

```
const classes = classNames('menu-item', {
  'active': currentActive === index
})
```

- 所以在点击事件之后立即检查 `thirdItem.className`，可能还没更新 → 断言失败

#### `waitFor`

```js
await waitFor(() => {
  expect(wrapper.getByText('xyz')).toHaveClass('active')
})
```

- `waitFor` 会循环执行回调，直到：
  1. 断言通过
  2. 或者超时
- 这样就能等待 **React 异步更新完成**，拿到最新的 DOM class

#### beforeEach cleanup（）

```js
beforeEach(() => {
    // 每个测试用例运行前执行
    wrapper = render(generateMenu(defaultProps))
    //拿到被标记 data-testid="test-menu" 的 DOM 元素(即<ul>)
    menuElement = wrapper.getByTestId('test-menu')
    activeElement = wrapper.getByText('active')
    disabledElement = wrapper.getByText('disabled')
  })
```

```js
test('vertical menu', () => {
    //清除wrapper渲染的defaultProps，里面也有test-menu所以查找到多个
    cleanup()
    const verticalWrapper = render(generateMenu(VerticalProps))
    const verticalMenuElement = verticalWrapper.getByTestId('test-menu')
    expect(verticalMenuElement).toHaveClass('menu-vertical')  // 检查默认类名
  })
```

### renderChildren

1、**统一处理子元素**

在复杂组件里，`children` 可能有各种类型：`MenuItem`、`SubMenu`、甚至其他 React 元素

如果直接 `{children}` 渲染，可能出现非法元素或渲染错误

`renderChildren` 可以：

- 过滤掉不合法的元素
- 给每个合法子元素自动加 `index`、`key` 等属性

2、**方便扩展子菜单**

当你增加 `SubMenu` 或动态生成菜单时，不用修改父组件核心渲染逻辑

可以在 `renderChildren` 里做统一逻辑：

- 添加 context
- 注入 props
- 做类型检查

3、**保证组件健壮性**

防止开发者传入错误的子元素

比如 `<Menu>123</Menu>`，直接渲染就乱了，用 `renderChildren` 可以过滤掉

```js
const renderChildren = () => {
        //React.Children 是 React 提供的一个工具对象，专门用来操作组件的 children 属性
        return React.Children.map(children, (child, index) => {
            //child 是一个 React 元素，它的 props 类型是 MenuItemProps
            const childElement = child as React.ReactElement<MenuItemProps>
            //类型保护，判断childElement.type是否为函数组件
            // type 可能是：
            // HTML 标签（'div'、'ul'） → 没有 displayName
            // React 组件（函数组件、class组件） → 有 displayName
            if (typeof childElement.type === 'function') {
                const type = childElement.type as { displayName?: string }
                const displayName = type.displayName
                if (displayName === 'MenuItem') {
                    return child
                } else {
                    console.error('Menu children must be MenuItem')
                    return null
                }
            } else {
                console.error('Menu children must be function component')
                return null
            }
        })
    }
```

在menuItems中定义了displayName

```js
MenuItem.displayName = 'MenuItem'
```

#### 测试（浏览器中）：

```js
<Menu mode="vertical" defaultIndex={0} onSelect={(index) => console.log(index)}>
        <MenuItem index={0}>首页</MenuItem>
        <MenuItem index={1} disabled>关于</MenuItem>
        <MenuItem index={2}>联系</MenuItem>
        <li>123</li> 
        //输入不合法字符
</Menu>
```

![image-20251201155803049](assets/image-20251201155803049.png)

有报错

#### 测试（文件中）：

Vitest 测试：默认console.log被拦截，需要 `spyOn` 才能捕获。

`spy`（间谍）本质上就是“监听一个函数被调用的情况”，你可以检查：

- 函数是否被调用
- 调用次数
- 调用参数

```js
const spy = vi.spyOn(console, 'error')//监听console函数

expect(spy).toHaveBeenCalledWith('Menu children must be function component')
expect(spy).toHaveBeenCalledWith('Menu children must be MenuItem')
//恢复原函数，也就是撤销 spy 的监听
spy.mockRestore()
```

#### 自动添加index

```js
if (displayName === 'MenuItem') {
     //给menuitem自动添加index属性
     const indexProp = childElement.props.index ?? index;
     return React.cloneElement(childElement, { index: indexProp });
}
```


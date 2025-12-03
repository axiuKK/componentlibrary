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

```js
//context属性种类
interface IMenuContext {
    index: number;
    onSelect: (index: number) => void;
    mode?: MenuMode;
}

//context默认值
export const MenuContext = createContext<IMenuContext>({
    index: 0,
    onSelect: () => { },
    mode: 'horizontal',
})
```

provider中实际传入的值

```js
const passedContext: IMenuContext = {
        index: currentActive,
        onSelect: (index) => {
            setCurrentActive(index)
            onSelect(index)
            alert(index)
        },
        mode,
    }
```

包裹组件

```js
return (
    	//包裹
        <MenuContext.Provider value={passedContext}>
            <ul className={classes} style={style}>
                {children}
            </ul>
        </MenuContext.Provider>
        //包裹
    )
```



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

### 添加 **下拉菜单（SubMenu）**

修改样式css--很难

#### 下拉菜单的open

在menu组件的context中传入mode判断是垂直还是水平

```js
//传入context
const { index: currentActive, mode } = useContext(MenuContext)

//处理hover
    let timer: any
    const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
        clearTimeout(timer)
        e.stopPropagation()
        timer = setTimeout(() => {
            setMenuOpen(toggle)
        }, 300)
    }
    //click
    const clickEvents = mode === 'vertical' ? {
        onClick: handleClick,
    } : {}
    //hover
    const mouseEvents = mode !== 'vertical' ? {
        onMouseEnter: (e: React.MouseEvent) => handleMouse(e, true),
        onMouseLeave: (e: React.MouseEvent) => handleMouse(e, false),
    } : {}
```

绑定事件

```js
return (
        <li key={index} className='submenu-item' {...mouseEvents}>
            <div className='submenu-title' {...clickEvents}>
                {title}
            </div>

            <ul className={classes}>
                {renderChildren()}
            </ul>
        </li>
    )
```

#### 区分MenuItem和subMenu中的MenuItem的共有index

将index改成string类型

```js
// 顶层 MenuItem
<MenuItem index="0" />

// SubMenu
<SubMenu index="1" title="子菜单">
    <MenuItem index="1-0" />
    <MenuItem index="1-1" />
</SubMenu>
```

#### 默认展开功能

`defaultOpenSubMenus` 控制初始展开状态

新增menu属性

```js
defaultOpenSubMenus?: string[];
```

通过context传给subMenu

```js
    //排除未定义的defaultOpenSubMenus
    const opendSubMenus=defaultOpenSubMenus as Array<string>
    //如果是垂直菜单，且默认打开的子菜单包含当前子菜单索引，那么就设置为打开状态
    const isOpend = (index&&mode==='vertical') ? opendSubMenus?.includes(index) : false
    const [menuOpen, setMenuOpen] = useState(isOpend)
```

#### 测试

先修改index为string导致的错误

测试组件的展开（隐藏与显示）

```js
// 在测试环境里动态创建一段 CSS，用于控制 SubMenu 默认隐藏
const createStyleFile = () => {
  const cssFile: string = `
    .submenu{
      display: none;
    }
    .menu-opened{
      display: block;
    }
  `
  const style = document.createElement('style')
  style.innerHTML = cssFile
  return style
}
```

```js
wrapper.container.appendChild(createStyleFile())
```

使用异步实现

```js
test('horizontal submenu hover and click', async () => {
    expect(wrapper.queryByText('子项1')).not.toBeVisible()
    const dropdownElement = wrapper.getByText('下拉菜单')
    //模拟鼠标悬停事件
    fireEvent.mouseEnter(dropdownElement)
    await waitFor(() => {
      expect(wrapper.getByText('子项1')).toBeVisible()
    })
    //模拟点击事件
    fireEvent.click(wrapper.getByText('子项1'))
    await waitFor(() => {
      expect(defaultProps.onSelect).toHaveBeenCalledWith('4-0')
    })
    //模拟鼠标移出事件
    fireEvent.mouseLeave(dropdownElement)
    await waitFor(() => {
      expect(wrapper.getByText('子项1')).not.toBeVisible()
    })   
  })
```

## Icon

从fontawesome导入后加入library

```js
import Icon from './components/Icon/icon'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)
```

使用后出现一个向下箭头

```js
<Icon icon='arrow-down' theme='danger' size='10x' />
```

### 动态箭头

rotate旋转180°

```js
&:hover {
            .arrow-icon {
                transform: rotate(180deg);
            }
        }
```

对于vertical垂直时取消hover效果，但是点击后箭头会翻转

但是失败

```js
&.vertical {//垂直菜单没有hover效果
            .arrow-icon {
                transform: rotate(0deg) !important;
            }
        }

&.vertical.menu-opened {//垂直菜单打开时箭头旋转180度
            .arrow-icon {
                transform: rotate(180deg) !important;
            }
        }
```

由于渲染时要renderChildren，所以将classes放在ul上

但是这样就无法通过.vertical的className控制.arrow-icon

所以又新建了一个submenuItemclasses传入vertical

```js
<li key={index} className={submenuItemclasses} {...mouseEvents}>
            <div className='submenu-title' {...clickEvents}>
                {title}
                <Icon icon='angle-down' className='arrow-icon' />
            </div>

            <ul className={classes}>
                {renderChildren()}
            </ul>
        </li>
```

### 下拉菜单栏动画

```js
import {CSSTransition} from 'react-transition-group'
```

```js
.zoom-in-top-enter {
    opacity: 0;
    transform: scaleY(0);
}

.zoom-in-top-enter-active {
    opacity: 1;
    transform: scaleY(1);
    transition: transform 300ms cubic-bezier(0.23,1,0.32,1) 100ms, opacity 300ms cubic-bezier(0.23,1,0.32,1);
    transform-origin: center top;
}

.zoom-in-top-exit {
    opacity: 1;
}

.zoom-in-top-exit-active {
    opacity: 0;
    transform: scaleY(0);
    transition: transform 300ms cubic-bezier(0.23,1,0.32,1) 100ms, opacity 300ms cubic-bezier(0.23,1,0.32,1);
    transform-origin: center top;
}
```

#### 兼容问题

React 18+ 开始，`findDOMNode` 已经被移除， `react-transition-group` 内部还在偷偷用ReactDOM.findDOMNode(this)

用 `nodeRef` 彻底绕开 findDOMNode，nodeRef` 替代 `findDOMNode

```js
const nodeRef = useRef<HTMLUListElement>(null)

<CSSTransition
  in={open}
  timeout={300}
  classNames="zoom-in-top"
  unmountOnExit
  nodeRef={nodeRef}        // ✅ 关键
>
  <ul ref={nodeRef} className="submenu">//noderef
    {renderChildren()}
  </ul>
</CSSTransition>
```

CSSTransition
   |
   |—— 内部调用 findDOMNode(this)  ❌

你 -> useRef() -> DOM 节点 -> nodeRef -> CSSTransition✅

#### 只有显示动画没有离开特效

离开时css中设置为display：none，`display` 是 **不可动画的属性**。

添加unmountOnExit属性等 *离场动画播完* 再把 DOM 从页面中删除

```js
<CSSTransition
                in={menuOpen}
                timeout={300}
                classNames='zoom-in-top'
                appear
                nodeRef={nodeRef} 
                unmountOnExit //
            >
```

在未点击时不渲染节点

![image-20251202181126720](assets/image-20251202181126720.png)

点击后才渲染

![image-20251202181149726](assets/image-20251202181149726.png)

现在可以注释掉display：none代码

```js
.submenu {
        list-style: none;
        padding-left: 0;
        white-space: nowrap;
        min-width: 100%;
        //display: none;

        >.menu-item {
            padding: vars.$menu-item-padding-y vars.$menu-item-padding-x;
            cursor: pointer;
            transition: vars.$menu-transition;
            color: vars.$body-color;
            width: 100%;
            margin-left: 10px;

            &:hover,
            &.active {
                color: vars.$menu-item-active-color !important;
            }
        }

        &.menu-opened {
            //display: block;
        }
    }
```

## 封装成Transition组件

### 封装css

在 Sass 里，`@mixin` 是 **可复用的样式模板**

在`_mixins.scss` → 只放模板，在`_animation.scss` → 生成实际动画类

```js
@use './mixin' as m;

@include m.zoom-animation('top', scaleY(0), scaleY(1), center top);
@include m.zoom-animation('bottom', scaleY(0), scaleY(1), center bottom);
@include m.zoom-animation('left', scaleX(0), scaleX(1), center left);
@include m.zoom-animation('right', scaleX(0), scaleX(1), center right);
```

## Storybook

Storybook 是一个 **组件开发环境**，可以：

- 单独开发和调试 React/Vue/Angular 组件，不依赖整个应用
- 给每个组件写“故事（stories）”，展示不同状态
- 集成文档、测试和可访问性检查

简单说，它就是给你组件做一个 **独立的展示和调试工具箱**。

一个story记录了组件的一种渲染状态，同样类型的story放在一组，比如Button就是stories

![image-20251202202110610](assets/image-20251202202110610.png)

### 编写stories文件

一定要启动自动文档doc

```js
import { Button } from './button'
import { type Meta, type StoryObj } from '@storybook/react'

//Meta<组件类型> 定义了组件的元数据，包括标题、组件类型等
const buttonMeta: Meta<typeof Button> = {
    title: 'Button',
    component: Button,
    //启用自动文档
    tags: ['autodocs']
}

export default buttonMeta

//StoryObj<组件类型> 定义了组件的故事对象，包括参数、渲染函数等
type Story = StoryObj<typeof Button>

export const Default: Story = {
    name: 'Default Button',
    args: {
        children: 'Button',
    },
}
```

`Meta` 是组件档案， `Story` 是组件用法快照，`args` 就是 props

#### 配置样式

preview.js是 **Storybook 的“全局配置文件”**，给所有 stories 设置“公共规则 & 公共样式 & 公共装饰器”。

/storybook/preview.js

```js
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)
import '../src/styles/index.scss'
```

#### 模板

```js
//模板
const Template = (args: React.ComponentProps<typeof Button>) => (
  <Button {...args} />
)

export const Default: Story = {
  render: Template,
  args: {
    children: 'Default Button',
  },
}
```

#### 子组件

```js
const menuMeta: Meta<typeof Menu> = {
    title: 'menu',
    component: Menu,
    //子组件信息
    subcomponents: {
      Item: MenuItem,
      SubMenu,
    },
}
```

![image-20251203005920725](assets/image-20251203005920725.png)

#### 在button.tsx中添加注释可以在doc中显示

```js
/**
 * 页面中最常用的按钮元素，适合于完成特定的交互，支持HTML button和a链接的所有属性
 */
```

![image-20251203005907735](assets/image-20251203005907735.png)

### MDX

MDX 是 **Markdown + JSX** 的组合，是一种可以在 Markdown 文档中直接写 React 组件的文件格式。简单来说，你可以把它当成一个“可以写组件的 Markdown”。

`.mdx` 文件 = Markdown（文本、标题、列表、代码块） + 可以嵌入 React 组件。

可以实现自定义doc

## Input

![image-20251203011623999](assets/image-20251203011623999.png)

input.tsx

```js
//omit忽略接口中的size属性，因为我们自己定义了size属性
export interface InputProps extends Omit<InputHTMLAttributes<HTMLElement>, 'size'>
```

### 测试中只有stories没有test

在vite.config.ts中，project覆盖了原本的test配置，所以要在project中重新加上test路径

```js
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,//被覆盖
    // 可以直接使用 test/expect
    environment: "jsdom" // 模拟浏览器环境
    ,

    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')//只有对storybook的测试
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    },
    {
    extends: true,
    test: {
      include: ['tests/**/*.test.{ts,tsx}', 'src/**/*.test.tsx'],//加上test文件的测试
      globals: true,
      environment: 'jsdom'
    }
  }
  ]
  }
});
```

### menu测试修复

由于在transition中把submenu组件改成先开始不渲染，在click/hover后才渲染，所以在测试中查看子项的都出错了

把未渲染时对子组件的测试都删除即可，在渲染后添加

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

------

```js
// 给 props 设置默认值
// 当用户使用组件时，没有传某个 prop，就用这里设置的默认值
Button.defaultProps = {
  btnType: 'default',
  size: 'sm',
  disabled: false,
}
```

5️⃣ 完整组件框架

```js
import React from 'react'
import classNames from 'classnames'

export const Button = ({
  btnType,
  className,
  disabled,
  size,
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


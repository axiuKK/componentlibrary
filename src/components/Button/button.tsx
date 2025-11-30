import React from 'react'
import classNames from 'classnames'

// 定义字面量类型
export type ButtonSize = 'lg' | 'sm'
export type ButtonType = 'primary' | 'default' | 'danger' | 'link'

// 基础属性接口
interface BaseButtonProps {
  // 表示可有可不有，自定义类名
  className?: string;
  disabled?: boolean;
  size?: ButtonSize;
  btnType?: ButtonType;
  href?: string;
  // 超级联合类型
  children: React.ReactNode;
}

//继承原生属性+Parial将属性都改成可选的
type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;
type ButtonProps = BaseButtonProps & Partial<NativeButtonProps & AnchorButtonProps>;

//对BaseButtonProps解构props
export const Button = ({
  btnType,
  className,
  disabled,
  size,
  children,
  href,
  ...restProps
}: ButtonProps) => {
  // btn, btn-lg, btn-primary 拼接class
  // 最终效果：<button class="btn btn-primary btn-lg disabled"></button>
  const classes = classNames('btn', className, {
    // 变量属性名+模板字符串
    [`btn-${btnType}`]: btnType,
    [`btn-${size}`]: size,
    'disabled': (btnType === 'link') && disabled
  })
  if (btnType === 'link' && href) {
    return (
      <a
        className={classes}
        href={href}
        {...restProps}
      >
        {children}
      </a>
    )
  } else {
    return (
      <button
        className={classes}
        disabled={disabled}
        {...restProps}
      >
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

export default Button;
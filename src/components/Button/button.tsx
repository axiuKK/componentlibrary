import React from "react";
import classNames from "classnames";

// 定义字面量类型
export type ButtonSize = "lg" | "sm";
export type ButtonType = "primary" | "default" | "danger" | "link";

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
export type ButtonProps = BaseButtonProps &
  Partial<NativeButtonProps & AnchorButtonProps>;
/**
 * 页面中最常用的按钮元素，适合于完成特定的交互，支持HTML button和a链接的所有属性
 */

//对BaseButtonProps解构props
export const Button = ({
  btnType = "default",
  className,
  disabled = false,
  size = "sm",
  children,
  href,
  ...restProps
}: ButtonProps) => {
  // btn, btn-lg, btn-primary 拼接class
  // 最终效果：<button class="btn btn-primary btn-lg disabled"></button>
  const classes = classNames("btn", className, {
    // 变量属性名+模板字符串
    [`btn-${btnType}`]: btnType,
    [`btn-${size}`]: size,
    disabled: btnType === "link" && disabled,
  });
  if (btnType === "link" && href) {
    return (
      <a className={classes} href={href} {...restProps}>
        {children}
      </a>
    );
  } else {
    return (
      <button className={classes} disabled={disabled} {...restProps}>
        {children}
      </button>
    );
  }
};

export default Button;

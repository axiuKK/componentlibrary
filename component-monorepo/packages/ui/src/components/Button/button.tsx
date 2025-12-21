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
  children?: React.ReactNode;
  ariaLabel?: string | false;
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
  onClick,
  ariaLabel,
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

  let finalAriaLabel: string | undefined;

  if (ariaLabel === false) {
    // 用户明确说“不需要”，就不设 aria-label
    finalAriaLabel = undefined;
  } else if (typeof ariaLabel === "string") {
    // 用户提供了自定义 label
    finalAriaLabel = ariaLabel;
  } else {
    // 用户没传 ariaLabel → 我们自动检测 children 是否有文本
    const hasVisibleText =
      typeof children === "string" && children.trim() !== "";
    if (!hasVisibleText) {
      // ⚠️ 开发环境警告：缺少 ariaLabel
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "Button with non-text content should provide an `ariaLabel` for accessibility.",
        );
      }
      // 但不要强制中断，保持向后兼容
      finalAriaLabel = undefined;
    } else {
      // 有文本 → 不需要 aria-label
      finalAriaLabel = undefined;
    }
  }
  const ariaLabelProp =
    typeof finalAriaLabel === "string" ? { "aria-label": finalAriaLabel } : {};

  // 处理键盘事件
  const handleKeyDownButton = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === "Enter" || e.key === " ") && !disabled) {
      e.preventDefault();
      onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
    }
  };

  const handleKeyDownAnchor = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if ((e.key === "Enter" || e.key === " ") && !disabled) {
      e.preventDefault(); // 阻止默认滚动
      onClick?.(e as unknown as React.MouseEvent<HTMLAnchorElement>);

      if (href) {
        window.open(href, "_self"); // 模拟原生跳转
      }
    }
  };

  if (btnType === "link" && href) {
    if (disabled) {
      return (
        <span className={classes} {...restProps}>
          {children}
        </span>
      );
    } else {
      return (
        <a
          className={classes}
          href={href}
          onClick={onClick}
          onKeyDown={handleKeyDownAnchor}
          {...ariaLabelProp}
          {...restProps}
        >
          {children}
        </a>
      );
    }
  } else {
    return (
      <button
        className={classes}
        disabled={disabled}
        onClick={onClick}
        onKeyDown={handleKeyDownButton}
        {...ariaLabelProp}
        {...restProps}
      >
        {children}
      </button>
    );
  }
};

export default Button;

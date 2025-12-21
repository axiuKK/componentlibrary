import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button, { ButtonProps } from "../../../src/components/Button/button";
import "@testing-library/jest-dom/vitest";

const defaultProps = {
  onClick: vi.fn(),
};

const testProps: ButtonProps = {
  btnType: "primary",
  size: "lg",
  className: "klass",
  children: "props测试按钮",
};

const disabledProps: ButtonProps = {
  btnType: "link",
  size: "sm",
  disabled: true,
  className: "klass",
  children: "disabled测试按钮",
};

describe("Button 组件", () => {
  test("default button", () => {
    render(<Button>默认值</Button>);
    const btn = screen.getByRole("button", { name: "默认值" });

    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass("btn btn-default");
    expect(btn).not.toBeDisabled();
  });

  test("click button", () => {
    render(<Button {...defaultProps}>点击我</Button>);
    const btn = screen.getByRole("button", { name: "点击我" });

    fireEvent.click(btn);
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  test("button with different props", () => {
    render(<Button {...testProps}>不同属性值</Button>);
    const btn = screen.getByRole("button", { name: "不同属性值" });

    expect(btn).toHaveClass("btn btn-primary btn-lg klass");
  });

  test("link button & href", () => {
    render(
      <Button btnType="link" href="https://www.baidu.com">
        链接按钮
      </Button>,
    );
    const link = screen.getByRole("link", { name: "链接按钮" });

    expect(link).toHaveClass("btn btn-link");
    expect(link).toHaveAttribute("href", "https://www.baidu.com");
  });

  test("disabled button", () => {
    const onClick = vi.fn();
    render(
      <Button {...disabledProps} onClick={onClick}>
        disabled按钮
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "disabled按钮" });

    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  test("responds to Enter key", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Test</Button>);
    const btn = screen.getByRole("button", { name: "Test" });

    btn.focus();
    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

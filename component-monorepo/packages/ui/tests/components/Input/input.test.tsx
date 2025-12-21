import { Input } from "../../../src/components/Input/input";
import type { InputProps } from "../../../src/components/Input/input";
import { describe, expect, test, vi } from "vitest";
import { render } from "@testing-library/react";
import { fireEvent } from "storybook/test";
import "@testing-library/jest-dom/vitest";
import { useState } from "react";

const defaultProps: InputProps = {
  placeholder: "default input",
  onChange: vi.fn(),
  value: "",
};

describe("Input", () => {
  test("render default input", () => {
    const { container } = render(<Input {...defaultProps} />);
    const inputElement = container.querySelector("input") as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("placeholder", "default input");
  });
  test("render disabled input", () => {
    const { container } = render(<Input {...defaultProps} disabled />);
    const inputElement = container.querySelector("input") as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("placeholder", "default input");
    expect(inputElement).toHaveAttribute("value", "");
  });
  test("render lg input", () => {
    const { container } = render(<Input {...defaultProps} size="lg" />);
    const inputElement = container.querySelector("input") as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("placeholder", "default input");
    expect(inputElement).toHaveAttribute("value", "");
  });
  test("render sm input", () => {
    const { container } = render(<Input {...defaultProps} size="sm" />);
    const inputElement = container.querySelector("input") as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("placeholder", "default input");
    expect(inputElement).toHaveAttribute("value", "");
  });
  test("render icon input", () => {
    const { container } = render(<Input {...defaultProps} icon="search" />);
    const inputElement = container.querySelector("input") as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("placeholder", "default input");
    expect(inputElement).toHaveAttribute("value", "");
  });
  test("render prepend input", () => {
    const { container } = render(
      <Input {...defaultProps} prepend="https://" />,
    );
    const inputElement = container.querySelector("input") as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("placeholder", "default input");
    expect(inputElement).toHaveAttribute("value", "");
  });
  test("render append input", () => {
    const { container } = render(<Input {...defaultProps} append=".com" />);
    const inputElement = container.querySelector("input") as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("placeholder", "default input");
    expect(inputElement).toHaveAttribute("value", ""); // append 不影响 value
  });
  test("input works correctly", () => {
    const Wrapper = () => {
      const [value, setValue] = useState("");
      return <Input value={value} onChange={(e) => setValue(e.target.value)} />;
    };

    const { container } = render(<Wrapper />);
    const inputElement = container.querySelector("input") as HTMLInputElement;

    fireEvent.change(inputElement, { target: { value: "hello" } });
    expect(inputElement.value).toBe("hello");
  });
});

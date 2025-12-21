import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, type RenderResult } from "@testing-library/react";
import Upload, {
  type UploadProps,
} from "../../../src/components/Upload/upload.js";
import "@testing-library/jest-dom/vitest";
import axios from "axios";

vi.mock("../Icon/icon", () => {
  return (
    props: React.HTMLAttributes<HTMLSpanElement> & {
      icon: string;
      "data-testid"?: string;
    },
  ) => {
    // 保留 data-testid
    return (
      <span onClick={props.onClick} data-testid={props["data-testid"]}>
        {props.icon}
      </span>
    );
  };
});

vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

const testProps: UploadProps = {
  action: "fakeurl.com",
  onSuccess: vi.fn(),
  onChange: vi.fn(),
  onRemove: vi.fn(),
  drag: true,
};

let wrapper: RenderResult, fileInput: HTMLInputElement, uploadArea: HTMLElement;

const testFile = new File(["test"], "test.png", { type: "image/png" });
describe("Upload", () => {
  beforeEach(() => {
    wrapper = render(<Upload {...testProps}>Click to upload</Upload>);
    fileInput = wrapper.container.querySelector(
      ".file-input",
    ) as HTMLInputElement;
    uploadArea = wrapper.queryByText("Click to upload") as HTMLElement;
  });
  test("uploads file correctly", async () => {
    mockedAxios.post.mockResolvedValue({ data: "success" });

    fireEvent.change(fileInput, { target: { files: [testFile] } });

    // 等待文件出现在列表
    const uploadedFile = await wrapper.findByText("test.png");
    expect(uploadedFile).toBeInTheDocument();

    // 回调是否触发
    expect(testProps.onChange).toHaveBeenCalledWith(testFile);
    expect(testProps.onSuccess).toHaveBeenCalledWith("success", testFile);
  });

  test("drag file to upload area", async () => {
    mockedAxios.post.mockResolvedValue({ data: "ok" });

    fireEvent.dragEnter(uploadArea);
    fireEvent.dragOver(uploadArea);
    fireEvent.drop(uploadArea, { dataTransfer: { files: [testFile] } });

    const uploadedFile = await wrapper.findByText("test.png");
    expect(uploadedFile).toBeInTheDocument();
  });
});

import axios from "axios";
import { useRef, useState, useEffect, type ReactNode } from "react";
import UploadList from "./uploadList";
import Dragger from "./dragger";

export interface UploadProps {
  action: string;
  beforeUpload?: (file: File) => boolean | Promise<File>;
  onProgress?: (percentage: number, file: File) => void;
  onSuccess?: (data: unknown, file: File) => void;
  onError?: (error: unknown, file: File) => void;
  onChange?: (file: File) => void;
  defaultFileList?: UploadFile[];
  onRemove?: (file: UploadFile) => void;
  //自定义HTTP post请求
  headers?: { [key: string]: string };
  name?: string;
  data?: { [key: string]: string };
  withCredentials?: boolean;
  accept?: string;
  multiple?: boolean;
  children?: ReactNode;
  drag?: boolean;
}
export type UploadFileStatus = "ready" | "uploading" | "success" | "error";
export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status?: UploadFileStatus;
  percent?: number;
  //原始文件
  raw?: File;
  //上传成功后返回的数据
  response?: unknown;
  //上传失败后返回的错误信息
  error?: unknown;
}

const Upload = ({
  action = "/",
  beforeUpload,
  onProgress,
  onSuccess,
  onError,
  onChange,
  defaultFileList = [],
  onRemove,
  headers,
  name = "file",
  data,
  withCredentials,
  accept,
  multiple = true,
  children = "上传文件",
  drag = true,
}: UploadProps) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList);

  useEffect(() => {
    console.log("fileList 更新了:", fileList);
  }, [fileList]);

  const handleClick = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return;
    }
    upLoadFiles(files);
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  };
  const handleRemove = (file: UploadFile) => {
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    onRemove?.(file);
  };
  const upLoadFiles = (files: FileList) => {
    //把类数组对象 FileList 转换成真正的 Array<File>
    Array.from(files).forEach((file) => {
      if (beforeUpload) {
        const result = beforeUpload(file);
        //异步完成后上传
        if (result && result instanceof Promise) {
          result
            .then((res) => {
              post(res);
            })
            .catch((err) => {
              onError?.(err, file);
            });
        } else if (result) {
          post(file);
        }
      }
      //直接上传
      else {
        post(file);
      }
    });
  };
  const post = (file: File) => {
    const _file: UploadFile = {
      uid: Date.now().toString(),
      status: "ready",
      size: file.size,
      name: file.name,
      percent: 0,
      raw: file,
    };
    setFileList((prev) => [...prev, _file]);
    const formData = new FormData();
    formData.append(name || "file", file);
    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
    }
    //并发上传
    axios
      .post(action, formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
        withCredentials,
        //实时监听文件上传进度，并把当前完成百分比通知给组件外部
        onUploadProgress: (e) => {
          // 每次上传有进度变化就会执行
          const percentage = e.total
            ? Math.round((e.loaded * 100) / e.total)
            : 0;
          //防止与onSuccess冲突，只在进度不是100%时调用onProgress
          if (percentage < 100) {
            setFileList((prev) =>
              prev.map((item) =>
                item.uid === _file.uid
                  ? { ...item, percent: percentage, status: "uploading" }
                  : item,
              ),
            );
            if (onProgress) {
              onProgress(percentage, file);
            }
          }
        },
      })
      .then((res) => {
        setFileList((prev) =>
          prev.map((item) =>
            item.uid === _file.uid
              ? { ...item, status: "success", response: res.data }
              : item,
          ),
        );
        onSuccess?.(res.data, file);
        onChange?.(file);
      })
      .catch((err) => {
        setFileList((prev) =>
          prev.map((item) =>
            item.uid === _file.uid
              ? { ...item, status: "error", error: err }
              : item,
          ),
        );
        onError?.(err, file);
        onChange?.(file);
      });
  };

  return (
    <div className="upload-component">
      <div
        className="upload-input"
        style={{ display: "inline-block" }}
        onClick={handleClick}
      >
        {drag ? (
          <Dragger
            onFile={(files) => {
              upLoadFiles(files);
            }}
          >
            {children}
          </Dragger>
        ) : (
          children
        )}
        <input
          className="file-input"
          style={{ display: "none" }}
          ref={fileInput}
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
          type="file"
          name={name}
        />
      </div>
      <UploadList fileList={fileList} onRemove={handleRemove} />
    </div>
  );
};

export default Upload;

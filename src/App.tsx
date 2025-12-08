import axios from "axios";
import { useState, useEffect, type ChangeEvent } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas);

function App() {
  const [title, setTitle] = useState("");
  const postData = {
    title: "title",
    body: "body",
  };
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts/1", {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        responseType: "json",
      })
      .then((res) => {
        console.log(res.data);
        setTitle(res.data.title);
      });
  }, []);

  useEffect(() => {
    axios
      .post("https://jsonplaceholder.typicode.com/posts", postData)
      .then((res) => {
        console.log(res.data);
        setTitle(res.data.title);
      });
  }, []);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // 取用户选择的第一个文件
    const file = e.target.files?.[0];
    if (file) {
      //封装表单数据
      const formData = new FormData();
      formData.append("file", file);
      axios
        .post("https://jsonplaceholder.typicode.com/posts", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);
          setTitle(res.data.title);
        });
    }
  };

  return (
    <div className="App" style={{ marginTop: "100px", marginLeft: "100px" }}>
      <input type="file" name="file" onChange={handleFileChange}></input>
    </div>
  );
}

export default App;

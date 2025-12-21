import { AutoComplete, type DataSourceType } from "./autoComplete";
import { type Meta, type StoryObj } from "@storybook/react";

const autoCompleteMeta: Meta<typeof AutoComplete> = {
  title: "AutoComplete",
  component: AutoComplete,
  tags: ["autodocs"],
};

export default autoCompleteMeta;

const lakers = [
  "bradley",
  "pope",
  "caruso",
  "cook",
  "cousins",
  "jams",
  "AD",
  "green",
  "howard",
  "kuzma",
  "McGee",
  "rando",
];
const lakersWithNumber = [
  { value: "bradley", number: 11 },
  { value: "pope", number: 1 },
  { value: "caruso", number: 4 },
  { value: "cook", number: 2 },
  { value: "cousins", number: 15 },
  { value: "james", number: 23 },
  { value: "AD", number: 3 },
  { value: "green", number: 14 },
  { value: "howard", number: 39 },
  { value: "kuzma", number: 0 },
];

interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  [key: string]: unknown; // 捕获其他未知字段
}

//菜单为string类型
export const Default: StoryObj<typeof AutoComplete> = {
  args: {
    value: "",
    //现在不能return string必须return Object类型
    fetchSuggestions: async (str: string) => {
      return lakers
        .filter((item) => item.includes(str))
        .map((item) => ({ value: item }));
    },
    onSelect: (item) => {
      console.log(item);
    },
  },
};

//AutoComplete现在是泛型，必须传入T明确数据源的类型
export const DefaultWithNumber: StoryObj<
  typeof AutoComplete<{ number: number }>
> = {
  args: {
    value: "",
    fetchSuggestions: async (str: string) => {
      return lakersWithNumber.filter((item) => item.value.includes(str));
    },
    onSelect: (item) => {
      console.log(item);
    },
    renderOption: (item) => {
      return (
        <div>
          <h2>Name: {item.value}</h2>
          <p>Number: {item.number}</p>
        </div>
      );
    },
  },
};

//测试异步，使用api接口
export const Async: StoryObj<typeof AutoComplete> = {
  args: {
    value: "",
    fetchSuggestions: async (str: string) => {
      const res = await fetch(`https://api.github.com/search/users?q=${str}`);
      const data = await res.json();
      const formatItems: DataSourceType<GitHubUser>[] = data.items
        .slice(0, 10)
        .map((item: GitHubUser) => ({
          value: item.login,
          ...item,
        }));

      console.log(formatItems);
      return formatItems;
    },
    onSelect: (item) => {
      console.log(item);
    },
  },
};

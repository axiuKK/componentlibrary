import { AutoComplete } from './autoComplete';
import { type Meta, type StoryObj } from '@storybook/react';
import { type DataSourceType } from './autoComplete';

const autoCompleteMeta: Meta<typeof AutoComplete> = {
    title: 'AutoComplete',
    component: AutoComplete,
    tags: ['autodocs'],
}

export default autoCompleteMeta;

const lakers = ['bradley', 'pope', 'caruso', 'cook', 'cousins',
    'jams', 'AD', 'green', 'howard', 'kuzma', 'McGee', 'rando']
const lakersWithNumber = [
    { value: 'bradley', number: 11 },
    { value: 'pope', number: 1 },
    { value: 'caruso', number: 4 },
    { value: 'cook', number: 2 },
    { value: 'cousins', number: 15 },
    { value: 'james', number: 23 },
    { value: 'AD', number: 3 },
    { value: 'green', number: 14 },
    { value: 'howard', number: 39 },
    { value: 'kuzma', number: 0 },
]

//AutoComplete现在是泛型，必须传入T明确数据源的类型
export const Default: StoryObj<typeof AutoComplete<{ number: number }>> = {
    args: {
        value: '',
        fetchSuggestions: async (str: string) => {
            return lakersWithNumber.filter(item => item.value.includes(str))
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
            )
        }
    }
}

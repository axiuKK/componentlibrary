import { AutoComplete } from './autoComplete';
import { type Meta, type StoryObj } from '@storybook/react';

const autoCompleteMeta: Meta<typeof AutoComplete> = {
    title: 'AutoComplete',
    component: AutoComplete,
    tags: ['autodocs'],
}

export default autoCompleteMeta;

type Story = StoryObj<typeof AutoComplete>;

export const Default: Story = {
  args: {
    value: '',
    fetchSuggestions: async (str: string) => {
      const lakers = ['bradley','pope','caruso','cook','cousins',
                      'jams','AD','green','howard','kuzma','McGee','rando']
      return lakers.filter(item => item.includes(str))
    },
    onSelect: (item: string) => {
      console.log(item);
    },
    renderOption: (item: string) => {
      return <h2>Name: {item}</h2>
    }
  }
}

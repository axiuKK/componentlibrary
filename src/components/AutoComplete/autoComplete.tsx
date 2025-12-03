import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { InputProps } from '../Input/input';
import { Input } from '../Input/input';

export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
    // 过滤筛选，fetch异步
    fetchSuggestions: (str: string) => Promise<string[]>
    onSelect?: (item: string) => void
}

export const AutoComplete = ({
    fetchSuggestions,
    onSelect,
    value = '',
    ...restProps
}: AutoCompleteProps) => {
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    console.log('suggestions', suggestions);
    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        if (value) {
            const results = await fetchSuggestions(value);
            setSuggestions(results);
        } else {
            setSuggestions([]);
        }
    }

    return (
        <div className="auto-complete-wrapper">
            <Input
                value={inputValue}
                onChange={handleChange}
                {...restProps}
            />
        </div>
    )
}
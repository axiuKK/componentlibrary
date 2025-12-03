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
    const handleSelect = (item: string) => {
        setInputValue(item);
        setSuggestions([]);
        // 触发选择回调,把选中的值传给父组件
        onSelect?.(item);
    }

    // 生成下拉列表
    const generateDropDown = () => {
        return (
            <ul>
                {suggestions.map((item, index) => (
                    <li key={index}
                        onClick={() => handleSelect(item)}>
                        {item}
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div className="auto-complete-wrapper">
            <Input
                value={inputValue}
                onChange={handleChange}
                {...restProps}
            />
            {suggestions.length > 0 && generateDropDown()}
        </div>
    )
}
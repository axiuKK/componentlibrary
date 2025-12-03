import { useState, useEffect } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import type { InputProps } from '../Input/input';
import { Input } from '../Input/input';
import Icon from '../Icon/icon';

interface DataSourceObject {
    value: string
}
export type DataSourceType<T = {}> = T & DataSourceObject

export interface AutoCompleteProps<T = {}> extends Omit<InputProps, 'onSelect'> {
    // 过滤筛选，fetch异步
    fetchSuggestions: (str: string) => Promise<DataSourceType<T>[]>
    onSelect?: (item: DataSourceType<T>) => void
    renderOption?: (item: DataSourceType<T>) => ReactNode
}

export const AutoComplete = <T,>({
    fetchSuggestions,
    onSelect,
    value = '',
    renderOption,
    ...restProps
}: AutoCompleteProps<T>) => {
    const [inputValue, setInputValue] = useState(value as string);
    const [suggestions, setSuggestions] = useState<DataSourceType<T>[]>([]);
    const [loading, setLoading] = useState(false);

    //防抖节流，避免频繁请求
    useEffect(() => {
        const fetchData = async () => {
            if (inputValue) {
                setLoading(true);
                const results = await fetchSuggestions(inputValue);
                setSuggestions(results);
                setLoading(false);
            } else {
                setSuggestions([]);
            }
        }

        fetchData();
    }, [inputValue]);

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
    }
    const handleSelect = (item: DataSourceType<T>) => {
        setInputValue(item.value);
        setSuggestions([]);
        // 触发选择回调,把选中的值传给父组件
        onSelect?.(item);
    }
    //存在renderOption则使用renderOption渲染，否则直接渲染item
    const renderTemplate = (item: DataSourceType<T>) => {
        return renderOption ? renderOption(item) : item.value
    }
    // 生成下拉列表
    const generateDropDown = () => {
        return (
            <ul>
                {suggestions.map((item, index) => (
                    <li key={index}
                        onClick={() => handleSelect(item)}>
                        {renderTemplate(item)}
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
            {loading && <Icon icon="spinner" spin />}
            {suggestions.length > 0 && generateDropDown()}
        </div>
    )
}
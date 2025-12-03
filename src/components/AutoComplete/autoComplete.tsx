import { useState, useEffect } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import type { InputProps } from '../Input/input';
import { Input } from '../Input/input';
import Icon from '../Icon/icon';
import useDebounce from '../../hooks/useDebounce';

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
    // 防抖处理后的输入值
    const debouncedValue = useDebounce(inputValue);

    //监听输入值变化
    useEffect(() => {
        const fetchData = async () => {
            if (debouncedValue) {
                setLoading(true);
                const results = await fetchSuggestions(debouncedValue);
                setSuggestions(results);
                setLoading(false);
            } else {
                setSuggestions([]);
            }
        }

        fetchData();
    }, [debouncedValue]);

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
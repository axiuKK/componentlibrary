import { useState, useEffect } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import type { InputProps } from '../Input/input';
import { Input } from '../Input/input';
import Icon from '../Icon/icon';
import useDebounce from '../../hooks/useDebounce';
import classNames from 'classnames';
import type { KeyboardEvent } from 'react';

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
    const [highlightIndex, setHighlightIndex] = useState(-1);
    // 防抖处理后的输入值
    const debouncedValue = useDebounce(inputValue);

    //监听输入值变化
    useEffect(() => {
        setHighlightIndex(-1);
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
    // 处理键盘事件
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case 'ArrowUp': // 上箭头
                setHighlightIndex((prevIndex) => Math.max(prevIndex - 1, -1));
                break;
            case 'ArrowDown': // 下箭头
                setHighlightIndex((prevIndex) => Math.min(prevIndex + 1, suggestions.length - 1));
                break;
            case 'Enter': // 回车键
                if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
                    handleSelect(suggestions[highlightIndex]);
                }
                break;
            case 'Escape': // 转义键
                setSuggestions([]);
                break;
        }
    }
    //存在renderOption则使用renderOption渲染，否则直接渲染item
    const renderTemplate = (item: DataSourceType<T>) => {
        return renderOption ? renderOption(item) : item.value
    }
    // 生成下拉列表
    const generateDropDown = () => {
        return (
            <ul>
                {suggestions.map((item, index) => {
                    // 高亮显示当前选中项
                    const itemClasses = classNames('suggestion-item', {
                        'item-highlighted': index === highlightIndex
                    });
                    return (
                        <li key={index}
                            className={itemClasses}
                            onClick={() => handleSelect(item)}>
                            {renderTemplate(item)}
                        </li>
                    )
                }
                )}
            </ul>
        )
    }

    return (
        <div className="auto-complete-wrapper">
            <Input
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                {...restProps}
            />
            {loading && <Icon icon="spinner" spin />}
            {suggestions.length > 0 && generateDropDown()}
        </div>
    )
}
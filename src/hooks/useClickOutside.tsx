import { type RefObject, useEffect } from 'react';

//ref：“点击外部”的目标元素的引用，handler：当点击发生在 ref 所指元素外部时执行的回调函数
const useClickOutside = (ref: RefObject<HTMLElement | null>, handler: () => void) => {
    useEffect(() => {
        //事件处理函数，鼠标点击事件
        const listener=(event:MouseEvent)=>{
            //如果ref.current存在且点击事件的目标元素不在ref.current内部
            if(ref.current && !ref.current.contains(event.target as Node)){
                handler();
            }
        }
        // 监听全局点击事件
        document.addEventListener('click', listener);
        // 组件卸载时移除点击事件监听
        return () => {
            document.removeEventListener('click', listener);
        }
    }, [ref, handler]);
}

export default useClickOutside;

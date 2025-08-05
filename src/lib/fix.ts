"use client"
import { unstableSetRender} from 'antd';
import { createRoot } from 'react-dom/client';

unstableSetRender((node,container: (Element | DocumentFragment) & { _reactRoot?: ReturnType<typeof createRoot> })=>{
    container._reactRoot ||= createRoot(container);
    const root: ReturnType<typeof createRoot> = container._reactRoot;
    root.render(node);
    
    return () =>
        new Promise<void>((resolve) => {
        setTimeout(() => {
            root.unmount();
            resolve();
        }, 0);
        });
})
export default function Fix(){
    return null
}
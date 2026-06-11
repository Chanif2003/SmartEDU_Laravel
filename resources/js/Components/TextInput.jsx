import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'block w-full rounded-lg border-gray-200 bg-white/50 px-4 py-3 text-gray-700 shadow-sm transition-all duration-200 ease-in-out hover:border-brand-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/20 ' +
                className
            }
            ref={localRef}
        />
    );
});

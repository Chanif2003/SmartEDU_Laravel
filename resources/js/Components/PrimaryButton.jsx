import { motion } from 'framer-motion';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            {...props}
            className={
                `inline-flex items-center justify-center rounded-lg border border-transparent bg-brand-600 px-5 py-2.5 text-sm font-semibold tracking-wide text-white transition-all duration-200 ease-in-out hover:bg-brand-500 hover:shadow-neon hover:shadow-brand-500/50 focus:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 active:bg-brand-700 ${
                    disabled && 'opacity-50 cursor-not-allowed hover:shadow-none hover:bg-brand-600'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
}

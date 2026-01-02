import { IconProps, defaultIconProps } from './types';

// Material Symbol: check
// https://fonts.google.com/icons?selected=Material+Symbols+Outlined:check
export default function CheckIcon({ size = 24, ...props }: IconProps) {
    return (
        <svg
            {...defaultIconProps}
            width={size}
            height={size}
            viewBox="0 -960 960 960"
            {...props}
        >
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
        </svg>
    );
}

import { IconProps, defaultIconProps } from './types';

// Material Symbol: arrow_back
// https://fonts.google.com/icons?selected=Material+Symbols+Outlined:arrow_back
export default function ArrowBackIcon({ size = 24, ...props }: IconProps) {
    return (
        <svg
            {...defaultIconProps}
            width={size}
            height={size}
            viewBox="0 -960 960 960"
            {...props}
        >
            <path d="M360-240 120-480l240-240 56 56-144 144h568v80H272l144 144-56 56Z" />
        </svg>
    );
}

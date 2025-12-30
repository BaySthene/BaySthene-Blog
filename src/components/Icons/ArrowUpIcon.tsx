import { IconProps, defaultIconProps } from './types';

// Material Symbol: keyboard_arrow_up
// https://fonts.google.com/icons?selected=Material+Symbols+Outlined:keyboard_arrow_up
export default function ArrowUpIcon({ size = 24, ...props }: IconProps) {
    return (
        <svg
            {...defaultIconProps}
            width={size}
            height={size}
            viewBox="0 -960 960 960"
            {...props}
        >
            <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" />
        </svg>
    );
}

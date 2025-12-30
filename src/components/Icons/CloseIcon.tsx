import { IconProps, defaultIconProps } from './types';

// Material Symbol: close
// https://fonts.google.com/icons?selected=Material+Symbols+Outlined:close
export default function CloseIcon({ size = 24, ...props }: IconProps) {
    return (
        <svg
            {...defaultIconProps}
            width={size}
            height={size}
            viewBox="0 -960 960 960"
            {...props}
        >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
    );
}

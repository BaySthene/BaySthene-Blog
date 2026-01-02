import { IconProps, defaultIconProps } from './types';

// Material Symbol: download
// https://fonts.google.com/icons?selected=Material+Symbols+Outlined:download
export default function DownloadIcon({ size = 24, ...props }: IconProps) {
    return (
        <svg
            {...defaultIconProps}
            width={size}
            height={size}
            viewBox="0 -960 960 960"
            {...props}
        >
            <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
        </svg>
    );
}

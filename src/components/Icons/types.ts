import { SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number;
}

export const defaultIconProps: Partial<IconProps> = {
    size: 24,
    fill: 'currentColor',
    xmlns: 'http://www.w3.org/2000/svg',
};

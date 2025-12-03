import type { SVGProps } from "react";

export type svgComponent = React.FunctionComponent<SVGProps<SVGSVGElement> & {
    title?: string;
    titleId?: string;
    desc?: string;
    descId?: string;
}>
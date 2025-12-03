import type { CSSProperties } from "react";
import type { svgComponent } from "../../_models/svgComponent.model";

interface IconProp {
    //All the following properties will apply to container
    id?: string;
    testID?: string,
    className?: string;
    onClick?: (ev: React.MouseEvent<HTMLDivElement>) => void;
    style?: CSSProperties;
    tabIndex?: number;
    alt?: string;

    //All the following properties will apply to 
    width?: string;
    height?: string;
    fillColour?: string;
    src: svgComponent;
}

function Icon(props: IconProp) {
    let { id, testID, className, onClick, style, tabIndex, width, height, fillColour, src: IconComponent } = props;
    width ??= "20px";
    height ??= "20px";
    fillColour ??= "darkgray"
    return (
        <div id={id} data-testid={testID} className={className} onClick={onClick} style={style} tabIndex={tabIndex}>
            <IconComponent
                width={width}
                height={height}
                fill={fillColour}
            ></IconComponent>
        </div>
    )
}
export default Icon
import Icon from '../../_components/icon/icon';
import { StarIcon } from '../../_svg';
import './MiniProductDetails.css';

interface MiniProductDetails {
    imgageURL: string,
    rating: number,
}
function MiniProductDetails({ imgageURL, rating }: MiniProductDetails) {

    return (
        <div className="productThumbnail">
            <img className='productImage' data-url={imgageURL} />
            <div className="rating">
                <Icon src={StarIcon} fillColour='yellow' />
                <span>{rating}/{window.config.maxRating}</span>
            </div>
        </div>
    )
}

export default MiniProductDetails
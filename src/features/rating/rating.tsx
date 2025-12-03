import { StarIcon } from '../../_svg';
import Icon from '../../_components/icon/icon'
import './rating.css'

function Rating(rating: number) {
    return (
        <div className="rating">
            <Icon src={StarIcon} fillColour='yellow' />
            <span>{rating}/{window.config.maxRating}</span>
        </div>
    )
}

export default Rating
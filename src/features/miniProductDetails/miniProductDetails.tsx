import { useEffect, useRef } from 'react'
import './MiniProductDetails.css'
import { StarIcon } from '../../_svg';
import Icon from '../../_components/icon/icon'

interface MiniProductDetails {
    imgageURL: string,
    rating: number,
    observer: IntersectionObserver | null
}
function MiniProductDetails({ imgageURL, rating, observer }: MiniProductDetails) {
    const ref = useRef<HTMLImageElement>(null);

    useEffect(() => {
        ref.current && observer?.observe(ref.current)

        return () => {
            ref.current && observer?.unobserve(ref.current)
        }
    }, [])

    return (
        <div className="productThumbnail">
            <img className='productImage' ref={ref} data-url={imgageURL} />
            <div className="rating">
                <Icon src={StarIcon} fillColour='yellow' />
                <span>{rating}/{window.config.maxRating}</span>
            </div>
        </div>
    )
}

export default MiniProductDetails
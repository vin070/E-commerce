import { useEffect, useRef } from 'react'
import { } from './MiniProductDetails.css'

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
                <img src="assets/svg/star.svg" alt="Rating" />
                <span>{rating}/{window.config.maxRating}</span>
            </div>
        </div>
    )
}

export default MiniProductDetails
import './rating.css'
function Rating(rating: number) {
    return (
        <div className="rating">
            <img src="assets/svg/star.svg" alt="Rating" />
            <span>{rating}/{window.config.maxRating}</span>
        </div>
    )
}

export default Rating
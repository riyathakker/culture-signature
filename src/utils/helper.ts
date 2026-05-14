export const convertINRToDiscountPercentage = (originalPrice: number, discountPrice: number) => {
    if (originalPrice <= 0 || discountPrice <= 0) {
        return null;
    }
    return Math.round((discountPrice / originalPrice) * 100);
};
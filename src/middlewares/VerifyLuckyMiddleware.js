export const VerifyLuckyMiddleware = (req, res, next) => {
    const random_user = Math.random();
    if (random_user > 0.5) {
        //Tiene Suerte
        next();
    } else {
        //No tiene suerte
        res.json({
        meesage: "No tenes suerte",
        });
    }
};

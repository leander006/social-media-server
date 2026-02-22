module.exports = (req, res, next) => {
    const csrfCookie = req.cookies.csrf_token;
    const csrfHeader = req.headers["x-csrf-token"];

    if (!csrfCookie || csrfCookie !== csrfHeader) {
        return res.status(403).json({ message: "CSRF attack blocked" });
    }
    next();
};

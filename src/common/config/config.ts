export default() => ({
    jwt: {
        secret: process.env.JWT_SECRET,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    },
    mailer: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    cors: {
        origin: process.env.CORS_ORIGIN,
    }
})
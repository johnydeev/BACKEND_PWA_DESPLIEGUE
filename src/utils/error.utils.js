export class ServerError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

export const handleError = (res, error) => {
    if (error.status) {
        return res.status(error.status).send({
            ok: false,
            message: error.message,
            status: error.status,
        });
    }
    return res.status(500).send({
        ok: false,
        message: error.message,
        status: 500,
    });
};
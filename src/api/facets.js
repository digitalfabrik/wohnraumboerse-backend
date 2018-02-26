import { Router } from 'express';

export default () => {
    const router = new Router();
    router.get('/', (req, res) => {
        res.json(req.city)
    });

    return router
}

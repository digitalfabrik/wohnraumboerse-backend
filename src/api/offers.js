import { Router } from 'express';

export default ({config, db}) => {
    const router = new Router();
    router.get('/', (req, res) => {
        res.json(req.city)
    });

    return router
}

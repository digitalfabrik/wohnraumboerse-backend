import {version} from '../../package.json';
import {Router} from 'express';
import offers from './offers';

export default ({config, db}) => {
    const api = Router();


    api.param('city', (req, res, next, id) => {
        req.city = id;
        next()
    });
    api.use('/v0/:city', offers({config, db}));

    return api;
}

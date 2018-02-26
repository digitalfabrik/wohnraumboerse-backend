import {version} from '../../package.json';
import {Router} from 'express';
import facets from './facets';

export default () => {
    const api = Router();


    api.param('city', (req, res, next, id) => {
        req.city = id;
        next()
    });
    api.use('/v0/:city', facets());

    return api;
}

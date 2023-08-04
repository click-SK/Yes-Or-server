import * as TokenService from '../services/AdminTokenService.js';
export default async function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader) {
            return res.status(403).json({
                message: 'Error authorization header',
              });
        }
        const accessToken = authorizationHeader.replace(/Bearer\s?/, '');
        if(!accessToken) {
            return res.status(403).json({
                message: 'Error access token',
              });
        }

        const userData = await TokenService.validateAccessToken(accessToken);

        if(!userData) {
            return res.status(403).json({
                message: 'Error user data',
              });
        }
        req.user = userData;
        next();
    } catch (e) {
        return res.status(403).json({
            message: 'Erro cetch',
          });
    }
  }
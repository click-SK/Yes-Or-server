import * as TokenService from '../services/UserTokenService.js';
export default async function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        console.log('authorizationHeader',authorizationHeader);
        if(!authorizationHeader) {
            return res.status(403).json({
                message: 'Error authorization header',
              });
        }
        const accessToken = authorizationHeader.replace(/Bearer\s?/, '');
        console.log('accessToken',accessToken);
        if(!accessToken) {
            return res.status(403).json({
                message: 'Error access token',
              });
        }

        const userData = await TokenService.validateAccessToken(accessToken);

        console.log('userData',userData);

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
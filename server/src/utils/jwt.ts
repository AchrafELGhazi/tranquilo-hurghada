// import jwt from 'jsonwebtoken';
// import { jwtConfig } from '../config/jwt';
// import { JwtPayload } from '../types/auth.types';

// export const generateToken = (payload: JwtPayload): string => {
//   return jwt.sign(payload, jwtConfig.secret, {
//     expiresIn: jwtConfig.expiresIn,
//   });
// };

// export const verifyToken = (token: string): JwtPayload => {
//   return jwt.verify(token, jwtConfig.secret) as JwtPayload;
// };

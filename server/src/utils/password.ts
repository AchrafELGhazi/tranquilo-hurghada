import bcrypt from 'bcrypt';
import logger from '../config/logger';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
     try {
          return await bcrypt.hash(password, SALT_ROUNDS);
     } catch (error) {
          logger.error('Error hashing password:', error);
          throw new Error('Error hashing password');
     }
};

export const comparePasswords = async (
     plainPassword: string,
     hashedPassword: string
): Promise<boolean> => {
     try {
          return await bcrypt.compare(plainPassword, hashedPassword);
     } catch (error) {
          logger.error('Error comparing passwords:', error);
          throw new Error('Error comparing passwords');
     }
};
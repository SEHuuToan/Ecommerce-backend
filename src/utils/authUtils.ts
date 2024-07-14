import {hashPassword, comparePassword} from '../services/authService';

async function hashPasswordUtils(password: string) {
    return await hashPassword(password);
}
async function comparePasswordUtils(password: string, hashedPassword: string) {
    return await comparePassword(password, hashedPassword);
}
export {
    hashPasswordUtils,
    comparePasswordUtils,
}
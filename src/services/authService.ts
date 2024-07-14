import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
 const isMatch = await bcrypt.compare(password, hashedPassword);
 return isMatch;   
}

export {
    hashPassword,
    comparePassword,
}
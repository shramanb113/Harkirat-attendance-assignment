import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = Number(process.env.SALT_ROUND) || 10;

  const hashed = await bcrypt.hash(password, saltRounds);

  return hashed;
};

export const comparePassword = async (passwordAttempt :string , hashedPassword:string) : Promise<boolean> => {
  return await bcrypt.compare(passwordAttempt,hashedPassword)
}
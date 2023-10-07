import { hash, compare } from 'bcrypt';

export async function encryptPassword(password: string) {
  return hash(password, 10);
}

export async function validatePassword(inputPwd: string, dbPwd: string) {
  return compare(inputPwd, dbPwd);
}

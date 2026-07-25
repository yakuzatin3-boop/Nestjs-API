import * as bcrypt from 'bcryptjs';

export function hashPassword(
  password: string,
  saltRounds = 10,
): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) return reject(err);
      resolve(hash);
    });
  });
}

export function comparePassword(
  password: string,
  hashed: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashed, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

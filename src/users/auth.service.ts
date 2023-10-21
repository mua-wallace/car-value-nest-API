import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    // check if email is already in use
    const users = await this.userService.find(email);
    console.log(users);

    if (users.length) {
      throw new BadRequestException('email alreay in use');
    }

    // Hash the users password

    // Generate  a rendom salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed results and the salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const user = await this.userService.createUser(email, result);

    return user;
  }

  async signin(email: string, password: string) {
    // use email to fetch user from database
    const [user] = await this.userService.find(email);

    if (!user) {
      throw new BadRequestException('invalid  credential');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('invalid credentials');
    }
    return user;
  }
}

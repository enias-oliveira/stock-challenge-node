import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterDto } from 'src/auth/auth.dto';

@Injectable()
export class ValidateUserPipe implements PipeTransform {
  async transform(value: RegisterDto, { metatype }: ArgumentMetadata) {
    const userObject = plainToInstance(metatype, value);
    const errors = await validate(userObject);

    if (errors.length > 0) {
      throw new BadRequestException(
        'The request could not be understood by the server due to malformed syntax',
      );
    }

    return userObject;
  }
}

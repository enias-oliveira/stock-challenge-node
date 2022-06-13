import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ValidateUserPipe } from './parse-user.pipe';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Post()
    create(@Body(new ValidateUserPipe()) createUser: CreateUserDto) {
        return this.usersService.createUser(createUser);
    }

    @Get()
    findAll() {
        return this.usersService.users({});
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.usersService.user({ id });
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.usersService.deleteUser({ id });
    }
}

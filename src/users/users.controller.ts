import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Query,
  UseGuards,
  ValidationPipe,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminGuard } from 'src/admin/admin.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) id: number) {
    console.log('running in controller');
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Post('signup')
  createUser(@Body(new ValidationPipe()) body: CreateUserDto) {
    this.usersService.create(body.email, body.password, body.name);
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}

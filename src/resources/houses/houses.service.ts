import { Injectable } from '@nestjs/common';
import { CreateHouseDto } from './dto/request/create-house.dto';
import { UpdateHouseDto } from './dto/request/update-house.dto';
import { User } from 'src/resources/users/entities/user.entity';
import { House } from './entities/house.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Rule } from './entities/rule.entity';
import { Invitation } from './entities/invitation.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HousesService {
  constructor(
    @InjectRepository(House) private houseRepo: Repository<House>,
    @InjectRepository(Rule) private ruleRepo: Repository<Rule>,
    @InjectRepository(Invitation) private invitationRepo: Repository<Invitation>,
  ) {}

  async create(user: User, createHouseDto: CreateHouseDto) {
    const house = this.houseRepo.create({
      name: createHouseDto.name,
      description: createHouseDto.description,
      users: [user],
    });

    const savedHouse = await this.houseRepo.save(house);

    await Promise.all(
      createHouseDto.rules.map((ruleContent) =>
        this.ruleRepo.save(this.ruleRepo.create({ description: ruleContent, house: savedHouse })),
      ),
    );
    return savedHouse;
  }

  findAll() {
    return `This action returns all houses`;
  }

  findOne(attrs: FindOptionsWhere<User>) {
    if (Object.values(attrs).length === 0) {
      return null;
    }
    return this.houseRepo.findOneBy(attrs);
  }

  async update(house: House, updateHouseDto: UpdateHouseDto) {
    const { name, description, rules } = updateHouseDto;

    Object.assign(house, {
      ...(name && { name }),
      ...(description && { description }),
    });

    if (rules && rules.length > 0) {
      await this.ruleRepo.delete({ house: { id: house.id } });

      const newRules = rules.map((rule) => this.ruleRepo.create({ description: rule, house }));
      house.rules = await this.ruleRepo.save(newRules);
    }

    return this.houseRepo.save(house);
  }

  remove(id: number) {
    return `This action removes a #${id} house`;
  }

  createInvitation(house: House) {
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000);

    const invitation = this.invitationRepo.create({
      invitation_code: this.generateInvitationCode(),
      house,
      expires_at: expirationTime,
    });
    return invitation;
  }

  findOneWithInvitation(invitationCode: string) {
    return `This action looks for invitation first and if invitation not expired, will return house info`;
  }

  createJoinRequest(invitationCode: string) {
    return 'This action create a join request.';
  }

  leave(user: User) {
    return 'This action will make user leave a house.';
  }

  isUserMemberOfHouse(user: User, house: House) {
    return 'This action return if user member of a house.';
  }

  private generateInvitationCode(): string {
    return uuidv4();
  }
}

// src/services/hashPasswordService.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

class HashPasswordService {
  private saltRounds: number;

  constructor(saltRounds: number = 10) {
    this.saltRounds = saltRounds;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async checkPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  

  async createUser(email: string, password: string, name?: string, bio?: string): Promise<void> {
    const hashedPassword = await this.hashPassword(password);
    
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        bio: bio || '',
      },
    });
    
    console.log(`Usuario ${email} criado com sucesso`);
  }
}

export default new HashPasswordService();

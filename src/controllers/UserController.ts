import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import HashPasswordService from "../utils/HashPassword";

const prisma = new PrismaClient();

class UserController {
  constructor() {}

  async listUser(req: Request, res: Response): Promise<Response> { // Altera o retorno para Response
    try {
      const users = await prisma.user.findMany();
      return res.json(users); // Use return aqui
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch users.' });
    }
  }

  async createUser(req: Request, res: Response): Promise<Response> { // Altera o retorno para Response
    const { email, password, name, bio } = req.body;

    try {
      await HashPasswordService.createUser(email, password, name, bio || '');
      return res.status(201).json({ message: 'User created successfully' }); // Use return aqui
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Failed to create user.' });
    }
  }

  async updateUser(req: Request, res: Response): Promise<Response> { // Altera o retorno para Response
    try {
      const id = parseInt(req.params.id);
      const { email, password, name, bio, profile_image } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ status: 400, message: "ID do usuário inválido." });
      }

      const existingUser = await prisma.user.findUnique({ where: { id } });

      if (!existingUser) {
        return res.status(404).json({ status: 404, message: "Usuário não encontrado." });
      }

      let hashedPassword: string | undefined;
      if (password) {
        hashedPassword = await HashPasswordService.hashPassword(password);
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          email: email || existingUser.email,
          password: hashedPassword || existingUser.password,
          name: name !== undefined ? name : existingUser.name,
          bio: bio !== undefined ? bio : existingUser.bio,
          profile_image: profile_image !== undefined ? profile_image : existingUser.profile_image,
        },
      });

      const { password: _, ...userWithoutPassword } = updatedUser;

      return res.status(200).json({
        status: 200,
        message: "Usuário atualizado com sucesso.",
        user: userWithoutPassword,
      }); // Use return aqui
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, message: "Erro ao atualizar o usuário." });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> { // Altera o retorno para Response
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ status: 400, message: "ID do usuário inválido." });
      }

      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        return res.status(404).json({ status: 404, message: "Usuário não encontrado." });
      }

      await prisma.user.delete({ where: { id } });

      return res.status(200).json({ status: 200, message: "Usuário deletado com sucesso." }); // Use return aqui
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, message: "Erro ao deletar o usuário." });
    }
  }
}

export default new UserController();

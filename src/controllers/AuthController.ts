import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import HashPasswordService from "../utils/HashPassword"; // Import the HashPasswordService

const prisma = new PrismaClient();

class AuthController {
  constructor() {}

  async signin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Email ou password não encontrados!",
        });
      }

      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(401).json({
          message: "Email não existe!",
        });
      }

      
      const passwordCheck = await HashPasswordService.checkPassword(password, user.password);

      if (!passwordCheck) {
        return res.status(401).json({
          message: "Usuário ou senha inválidos!",
        });
      }

      return res.status(200).json({
        user: {
          token: "jioejoiqjoeijqoiejoi", 
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }

  async signup(req: Request, res: Response) {
    try {
      const { email, password, name, profile_image, bio } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Email e password são obrigatórios!",
        });
      }

      const existingUser = await prisma.user.findFirst({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "Email já está em uso!",
        });
      }

     
      await HashPasswordService.createUser(email, password, name, bio || '');

      return res.status(201).json({
        message: "Usuário criado com sucesso!",
        user: {
          email, 
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }

  async signout(req: Request, res: Response) {
    res.status(200).json({
      message: "Usuário desconectado com sucesso!",
    });
  }
}

export default new AuthController();

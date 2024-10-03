import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class PostController{
    constructor(){

    }
    async listPosts(req: Request, res: Response){
        try{
            const posts = await prisma.post.findMany();
  
            res.json(posts)
        }catch(error){
            console.log(error);
            return res.status(500).json({
                error: error
            })
        }
    }
    async createPost(req: Request, res: Response) {
        try {
            const { user_id, content, image_url } = req.body;

            
            if (!user_id) {
                return res.status(400).json({
                    status: 400,
                    message: "O campo 'user_id' é obrigatório.",
                });
            }

            if (!content) {
                return res.status(400).json({
                    status: 400,
                    message: "O campo 'content' é obrigatório.",
                });
            }

            
            const user = await prisma.user.findUnique({
                where: { id: user_id },
            });

            if (!user) {
                return res.status(404).json({
                    status: 404,
                    message: "Usuário não encontrado.",
                });
            }

            
            const newPost = await prisma.post.create({
                data: {
                    user_id,
                    content,
                    image_url: image_url || null, 
                },
            });

            res.status(201).json({
                status: 201,
                post: newPost,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: "Erro ao criar o post.",
            });
        }
    }

   
    async deletePost(req: Request, res: Response) {
        try {
            const postId = parseInt(req.params.id);

            if (isNaN(postId)) {
                return res.status(400).json({
                    status: 400,
                    message: "ID do post inválido.",
                });
            }

           
            const post = await prisma.post.findUnique({
                where: { id: postId },
            });

            if (!post) {
                return res.status(404).json({
                    status: 404,
                    message: "Post não encontrado.",
                });
            }

          
            await prisma.comment.deleteMany({
                where: {
                    post_id: postId,
                },
            });

         
            await prisma.post.delete({
                where: {
                    id: postId,
                },
            });

            res.status(200).json({
                status: 200,
                message: "Post deletado com sucesso.",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: "Erro ao deletar o post.",
            });
        }
    }

  
    async editPost(req: Request, res: Response) {
        try {
            const postId = parseInt(req.params.id);
            const { content, image_url } = req.body;

            if (isNaN(postId)) {
                return res.status(400).json({
                    status: 400,
                    message: "ID do post inválido.",
                });
            }

         
            if (!content) {
                return res.status(400).json({
                    status: 400,
                    message: "O campo 'content' é obrigatório.",
                });
            }

          
            const post = await prisma.post.findUnique({
                where: { id: postId },
            });

            if (!post) {
                return res.status(404).json({
                    status: 404,
                    message: "Post não encontrado.",
                });
            }

         
            const updatedPost = await prisma.post.update({
                where: {
                    id: postId,
                },
                data: {
                    content,
                    image_url: image_url !== undefined ? image_url : post.image_url,
                },
            });

            res.status(200).json({
                status: 200,
                post: updatedPost,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 500,
                message: "Erro ao editar o post.",
            });
        }
    }
}

export default new PostController();
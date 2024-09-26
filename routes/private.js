import express from "express"
import { PrismaClient } from "@prisma/client"

const router = express.Router()
const prisma = new PrismaClient()

router.get('/lista', async (req, res) => {
    try{
        const users = await prisma.user.findMany() //todos os usuários

        res.status(200).json({message:"Usuários listados com sucesso!", users})
    } catch (err){
        res.status(500).json({message: "Falha no Servidor"})
    }
})

export default router
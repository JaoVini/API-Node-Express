import express from "express";
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const router = express.Router()
const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET


//cadastro
router.post('/cadastro', async (req, res) => {
    try{
        const user = req.body

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(user.password, salt)

        const userDB = await prisma.user.create({
            data: {
                email: user.email,
                name: user.name,
                password: hashPassword,
            },
        })
        res.status(201).json(userDB)
    } catch (err) {
        res.status(500).json( {message: "1 - Erro no servidor, tente novamente"})
    }
})

//login
router.post('/login', async (req, res) => {
    try{
        const userInfo = req.body

        // busca o usuário no banco de dados
        const user = await prisma.user.findUnique({
            where: {email: userInfo.email},
        })


        // verifica se o usuário existe no banco de dados
        if(!user){
            return res.status(404).json( {message: "Usuário não encontrado 🤨"})
        }

        // compara a senha do banco com a que a do usuário digitou
        const isMatch = await bcrypt.compare(userInfo.password, user.password)

        if(!isMatch){
            return res.status(400).json({ message: "Senha inválida!"})
        }

        // gerar o token JWT e exibir informações como data e expiração de token em data unix
        const token = jwt.sign({ id: user.id}, JWT_SECRET, { expiresIn: '3m'})

        res.status(200).json(token)
    } catch(err) {
        res.status(500).json({message: "2- Erro no Servidor, tente novamente"})
    }

})

export default router

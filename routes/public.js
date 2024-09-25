import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()
const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET

//Cadastro
router.post('/cadastro', async (req, res) => {
    try {
    const user = req.body

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(user.password, salt) //criptografando a senha

    const userDB = await prisma.user.create({
        data: {
            email: user.email,
            user: user.name,
            password: hashPassword,
        },
    })
    res.status(201).json(userDB)
    } catch (err) {
        res.status(500).json({message: "Erro no Servidor, tente novamente."})
    }
})

//login
router.post('/login', async (req, res) =>{
    try{
        const userInfor = req.body

        //busca o usuário no banco de dados
        const user = await prisma.user.findUnique({ where: {email: userInfor.email}})

        //verifica se o usuário existe
        if(!user){
            return res.status(404).json({message: "Usuário não encontrado."})
        }

        //compara a senha do banco com a digitada
        const isMatch = await bcrypt.compare(userInfor.password, user.password)
        if (!isMatch){
            return res.status(400).json({message: "Senhha inválida."})
        }

        //gerar o Token JWT
        const token = jwt.sign({id: user.id}, JWT_SECRET, { expiresIn: '1m'})

        res.status(200).json(token)
    } catch (err) {
        res.status(500).json({message: "Erro no Servidor, tente novamente."})
    }
})


export default router

import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

//Cadastro
router.post('/cadastro', async (req, res) => {
    const user = req.body

    await prisma.user.create({
        data: {
            email: user.email,
            user: user.name,
            password
        }
    })
    res.status(201).json(user)
})

export default router
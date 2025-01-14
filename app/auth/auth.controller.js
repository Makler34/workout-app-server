import { faker } from "@faker-js/faker";
import { prisma } from "../prisma.js";
import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken";
import { hash, verify } from "argon2";
import { generateToken } from "./generate-token.js";
import { UserFields } from "../utils/user.utils.js";

// @desc Auth user
// @route POST /api/auth/login
// @access Public
export const authUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email
        },
    });

    if (!user) {
        res.status(400);
        throw Error('User not exist');
    }

    try {
        if (await verify(user.password, password)) {
            res.json({ user, token: generateToken(user.id)});
        } else {
            res.status(401);
            throw Error("email or password did not correct");
        }
    } catch (err) {
        res.status(500);
        throw Error(err);
    }
})


// @desc Register user
// @route POST /api/auth/register
// @access Public
export const registerUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const isHaveUser = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (isHaveUser) {
        res.status(400);
        throw new Error('User already exist');
    }

    const user = await prisma.user.create({
        data: {
            email, password: await hash(password), name: faker.person.fullName()
        },
        select: UserFields
    });

    const token = generateToken(user.id);

    res.json({ user, token });
})
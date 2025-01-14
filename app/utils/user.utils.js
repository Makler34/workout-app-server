import { prisma } from "../prisma.js";

export const UserFields = {
	id: true,
	createdAt: true,
	email: true,
	images: true,
	updatedAt: true,
	name: true
}


export const findUniqueUser = async (decoded) => {
	const userFound = await prisma.user.findUnique({
		where: {
			id: decoded.userId
		},
		select: UserFields
	})

	return userFound;
}

"use server"

import { auth } from "../../auth";
import { prisma } from "../../utils/prisma";

const getAllUser = async () => {
    try {
        const session = await auth();
        if (!session || !session.user) {
            throw new Error("No user session found");
        }

        const currentUserId = session.user.id;

        // Fetch all users except the current user
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: currentUserId,
                },
            },
        });

        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export default getAllUser;

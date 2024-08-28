"use server"

import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { prisma } from "../../utils/prisma";
export const Redirect =(pass:string)=>{
    return redirect(pass)
}
export const getAllUser = async () => {
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
            select:{id:true,image:true,name:true}
        });

        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};


"use server"
import { getAuthenticatedUser } from "@/config/useAuth";
import { generateApiKey } from "@/lib/generateAPIKey";
import { db } from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

interface APIKeyCreateDTO{
  name: string;
}

export async function createAPIKey(name: string) {
  
    try {
        const user = await getAuthenticatedUser();
        if(!user){
            return {
                success: false,
                data: null,
                error: "Not Authorized",
            }
        }
        const apiKey = generateApiKey()
        const existingKey = await db.apiKey.findUnique({
            where: { key: apiKey  },
          });
      
          if (existingKey) {
            return {
              success: false,
              data: null,
              error: "This Key Already exists",
            };
          }

          
          console.log(apiKey)
          const newApiKey = await db.apiKey.create({
            data:{
                orgId : user.orgId,
                key: apiKey,
                name
            }
          });
          revalidatePath("/dashboard/integrations/api")
          return{
            success: true,
            data: newApiKey,
            error: null
          }
         
    } catch (error) {
        console.log(error)
        return{
            success: false,
            data: null,
            error: "Something went wrong"

        }
    }
}

export async function getOrgApiKeys(orgId: string){
  try {
    const keys = await db.apiKey.findMany({
      orderBy:{
        createdAt: "desc"
      },
      where: {
        orgId,
      },
    });
    return keys
  } catch (error) {
    console.log(error)
    return[]
    
  }
}
export async function getOrgKey(orgId: string){
  try {
    const key = await db.apiKey.findFirst({
      orderBy:{
        createdAt: "desc"
      }, 
      where: {
        orgId,
      },
      select:{
        key: true,
      }
    });
    return key?.key
  } catch (error) {
    console.log(error)
    return null;
    
  }
}
export async function deleteAPIKey(id: string){
  try {
    await db.apiKey.delete({
      where:{
        id
      }
    });
    revalidatePath("/dashboard/integrations/api")
    return{
      success: true,
    }
  } catch (error) {
    console.log(error)
    return{
      success: false
    }
    
  }
}

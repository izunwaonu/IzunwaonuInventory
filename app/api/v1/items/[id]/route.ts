"use server"

import { db } from "@/prisma/db";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
  try {
      const headersList = await headers();
      const apiKey = headersList.get("x-api-key");
    
      if (!apiKey) {
        return new Response(
          JSON.stringify({data:null, error: "API Key is required", success: false }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
        )
       
      }
    
      const validKey = await db.apiKey.findUnique({ where: { key: apiKey } });
      if (!validKey) {
        return new Response(
          JSON.stringify({data:null, error: "Invalid API Key", success: false }), {
          status: 403,
          headers: { "Content-Type": "application/json" }
        }
        )
      }
      
      const productId =( await params ).id

      const item = await db.item.findUnique({
        where:{
            id: productId
        }
      })

      const response ={
        
        success: true,
        data:item,
        error: null,
      };
    return new Response(JSON.stringify(response),{
      status: 200,
      headers: { "Content-Type": "application/json" }
    })

    
  } catch (error) {
    console.error("Error fetching items:", error);
    return new Response(JSON.stringify({ 
        data: null,
        error: "Failed to fetch item",
        success: false
     }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
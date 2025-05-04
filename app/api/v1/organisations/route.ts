import { generateSlug } from "@/lib/generateSlug";
import { db } from "@/prisma/db";
import { ItemCreateDTO} from "@/types/item";
import { error } from "console";

export async function GET(request: Request) {
    try {
        // For example, fetch data from your DB here
    const organizations = await db.organization.findMany({
        orderBy:{
            createdAt: "desc"
        }
    })
      return new Response(JSON.stringify(organizations), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
        
    } catch (error) {
      return new Response(
        JSON.stringify({
          data: null,
          error: "Failed to create Item"
        }),
        {
          status: 500,
          headers: {"Content-Type": "application/json"}
        }
      );
        
    }
  }
   


export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { name } = body;
 
  // e.g. Insert new user into your DB
  const newUser = { id: Date.now(), name };
 
  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}
import { db } from "@/prisma/db";
import { NextRequest } from "next/server";



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const orgId = (await params).id;

    //parse pagination parameter for URL
    const searchParams = request.nextUrl.searchParams;
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    

    //Check if pagination is requested
    const isPaginated = pageParam !== null || limitParam !== null;
    if (isPaginated){

      //Handle pagenation request
      const page = parseInt(pageParam || "1");
      const limit = parseInt(limitParam || "10");
      const skip = (page - 1)* limit;

      //Get item with pagination
      const items = await db.item.findMany({
        orderBy:{
          createdAt: "desc",
        },
        where:{
          orgId,
        },
        select:{
          id:true,
          name:true,
          slug:true,
          thumbnail:true,
          costPrice:true,
          sellingPrice:true,
          salesCount:true,
          salesTotal:true,
          createdAt:true,
        },
        skip,
        take:limit,
      });

      //Get total count for pagination
      const totalItems = await db.item.count({
        where:{
          orgId,
        },
      });

      //Calculate total pages
      const totalPages = Math.ceil(totalItems/ limit);

      //Construct response with data and pagination

      const response ={
        
        success: true,
        data:{
          data:items,
        pagination:{
          total :totalItems,
          page,
          limit,
          pages: totalPages,
        },
        },  error: null
      };

      return new Response(JSON.stringify(response),{
        status: 200,
        headers: {"Content-Type": "application/json"},
      });
      
    } else {
      //Return all items without pagination
      const items = await db.item.findMany({
        orderBy:{
          createdAt: "desc",
        },
        where:{
          orgId,
        },
        select:{
          id:true,
          name:true,
          slug:true,
          thumbnail:true,
          costPrice:true,
          sellingPrice:true,
          salesCount:true,
          salesTotal:true,
          createdAt:true,
        },
      });

      //construct response with just data

      const response = {
        
        success: true,
        data: {
          data: items,
        pagination:{
          total: items.length,
          page: 1,
          limit: items.length,
          pages: 1
        },
        }, error: null
      };
      return new Response(JSON.stringify(response),{
        status: 200,
        headers: {"Content-Type": "application/json"},
      });
    }
  } catch (error) {
    console.error("Error fetching items:", error);
    return new Response(
      JSON.stringify({
        data: null,
        error: "Failed to fetch Item",
        success: false,

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
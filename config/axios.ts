// "use server"
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { getOrgKey } from "@/actions/apiKey";
// import { getServerSession } from "next-auth";
// import { authOptions } from "./auth";
// import { getOrgKey } from "@/actions/apiKey";
// import { getAuthenticatedUser } from "./useAuth";
// // import { getAuthenticatedUser } from "./useAuth";
// // import { getOrgKey } from "@/actions/apiKey";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
// const session = await getServerSession(authOptions);
// const apiKey = await getOrgKey(session?.user.orgId??"")

const baseApi = axios.create({
    baseURL : `${BASE_URL}/api/v1`,
    headers:{
        "Content-Type": "application/json",
    }
});

export async function getAuthenticatedApi() {
    const session = await getServerSession(authOptions)
    const orgId = session?.user.orgId
    const apiKey = await getOrgKey(session?.user.orgId??"")

    //return a new instance with the API key
    return axios.create({
    baseURL : `${BASE_URL}/api/v1`,
    headers:{
        "Content-Type": "application/json",
        "x-api-key": apiKey || "",
    },
});
}
//Use this for authenticated request
export {baseApi as api};


//Example of how to use the API in a server action

export async function fetchProtectedData(endpoint: 
    string, params={}){
    try {
        const authenticatedApi = await getAuthenticatedApi();
        const response = await authenticatedApi.get(endpoint,{params})
        return response.data;
    } catch (error) {
        console.error("API request failed:", error)
        throw error;
        
    }
}


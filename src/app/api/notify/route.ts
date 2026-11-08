import apiHandler from "@/lib/nextApiHandler";
import postHandler from "./post";
import getHandler from "./get";

export const GET = apiHandler(getHandler);
export const POST = apiHandler(postHandler);

import apiHandler from "@/lib/nextApiHandler";
import getHandler from "./get";
import postHandler from "./post";

export const GET = apiHandler(getHandler);
export const POST = apiHandler(postHandler);

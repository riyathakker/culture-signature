import apiHandler from "@/lib/nextApiHandler";
import getHandler from "./get";
import postHandler from "./post";
import deleteHandler from "./delete";

export const GET = apiHandler(getHandler);
export const POST = apiHandler(postHandler);
export const DELETE = apiHandler(deleteHandler);

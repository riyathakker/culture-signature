import apiHandler from "@/lib/nextApiHandler";
import postHandler from "./post";

export const POST = apiHandler(postHandler);

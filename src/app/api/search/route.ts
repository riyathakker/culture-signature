import apiHandler from "@/lib/nextApiHandler";
import getHandler from "./get";

export const GET = apiHandler(getHandler);

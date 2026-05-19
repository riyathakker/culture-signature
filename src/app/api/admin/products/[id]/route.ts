import apiHandler from "@/lib/nextApiHandler";
import getHandler from "./get";
import patchHandler from "./patch";
import deleteHandler from "./delete";

export const GET = apiHandler(getHandler);
export const PATCH = apiHandler(patchHandler);
export const DELETE = apiHandler(deleteHandler);

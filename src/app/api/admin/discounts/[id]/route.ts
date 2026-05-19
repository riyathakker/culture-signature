import apiHandler from "@/lib/nextApiHandler";
import patchHandler from "./patch";
import deleteHandler from "./delete";

export const PATCH = apiHandler(patchHandler);
export const DELETE = apiHandler(deleteHandler);

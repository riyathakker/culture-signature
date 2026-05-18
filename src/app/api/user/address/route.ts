import apiHandler from "@/lib/nextApiHandler";

import deleteHandler from "./delete";
import getHandler from "./get";
import postHandler from "./post";
import patchHandler from "./patch";

export const DELETE = apiHandler(deleteHandler);
export const GET = apiHandler(getHandler);
export const POST = apiHandler(postHandler);
export const PATCH = apiHandler(patchHandler);

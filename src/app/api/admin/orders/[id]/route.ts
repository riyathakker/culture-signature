import apiHandler from "@/lib/nextApiHandler";
import patchHandler from "./patch";

export const PATCH = apiHandler(patchHandler);

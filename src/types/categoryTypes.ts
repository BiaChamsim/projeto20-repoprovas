import {Category} from "@prisma/client";

export type TestCategory = Omit<Category, "id">
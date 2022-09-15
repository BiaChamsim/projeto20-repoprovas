import {User} from "@prisma/client";

export type UserAuth = Omit<User, "id">
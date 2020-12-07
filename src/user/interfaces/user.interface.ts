import { User } from "src/entity/user.entity";

export class IUser {
    id?:number;
    username?: string;
    email?: string;
    password?: string
    bio?: string;
    image?: string | null;
    followers?: User[];
    followee?: User[];
}
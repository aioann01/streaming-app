import {UserRole} from "../../modules/auth/model/UserRoles";

export type UserInfo  = {
    role:UserRole;
    email:string
}
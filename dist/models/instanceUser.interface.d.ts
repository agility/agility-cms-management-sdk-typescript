import { InstanceRole } from "./instanceRole.interface";
import { InstancePermission } from "./websiteUser.interface";
export interface InstanceUser {
    userID: number;
    emailAddress: string | null;
    firstName: string | null;
    lastName: string | null;
    isDeleted: boolean;
    isTeamUser: boolean;
    defaultUILanguage: string | null;
    userName: string;
    instanceRoles: InstanceRole[];
    instancePermissions: InstancePermission[];
}

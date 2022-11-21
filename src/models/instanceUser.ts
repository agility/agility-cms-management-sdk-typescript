import { InstanceRole } from "./instanceRole";
import { InstancePermission } from "./websiteUser";

export class InstanceUser {
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
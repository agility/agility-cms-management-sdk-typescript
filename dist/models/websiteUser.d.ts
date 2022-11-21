import { InstanceRole } from "./instanceRole";
export declare class WebsiteUser {
    userID: number | null;
    userName: string | null;
    firstName: string | null;
    lastName: string | null;
    emailAddress: string | null;
    isDeleted: boolean;
    fullName: string | null;
    isTeamUser: boolean;
    isSuspended: boolean;
    teamID: number | null;
    userRoles: InstanceRole[];
    userPermissions: InstancePermission[];
    loginDate: string | null;
    isOrgAdmin: boolean;
}
export declare class InstancePermission {
    permissionType: string | null;
    permissionID: number;
    name: string | null;
}

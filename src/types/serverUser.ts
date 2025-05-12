import { WebsiteListing } from "./websiteListing";

export interface ServerUser {
    userID: number;
    userName: string | null;
    emailAddress: string | null;
    firstName: string | null;
    lastName: string | null;
    isInternalUser: boolean;
    isSuspended: boolean;
    isProfileComplete: boolean;
    adminAccess: boolean;
    currentWebsite: string | null;
    userTypeID: number;
    timeZoneRegion: string | null;
    password: string | null;
    passwordQuestion: string | null;
    passwordAnswer: string | null;
    websiteAccess: WebsiteListing[];
    jobRole: string | null;
    createdDate: string | null;
} 
export interface UserData {
    stateInstance: "notAuthorized" | "authorized" | "blocked" | "starting" | "suspended" | "pendingPassword";
    idInstance: number;
    apiTokenInstance: string;
}
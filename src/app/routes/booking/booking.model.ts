import {UserModel} from "../user/user.model";

export interface BookingModel {
    id: number;
    user: UserModel;
    createdAt: Date;
    updatedAt: Date;
}
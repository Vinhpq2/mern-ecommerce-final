export default interface Coupon {
    code: string;
    discountPercentage: number;
    createdAt: NativeDate;
    updatedAt: NativeDate; 
    discountPercentage: number;
    isActive: boolean;
    // isCouponApplied: boolean;
    userId: Types.ObjectId;
    exprirationDate?: NativeDate | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    // other properties of the coupon object
}
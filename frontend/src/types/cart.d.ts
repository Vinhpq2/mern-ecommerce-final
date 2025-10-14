export interface Cart {
    quantity: number;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    isFeatured: boolean;
    _id: Types.ObjectId;
    __v: number
};
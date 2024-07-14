
export interface OrderData{
    phoneNumber:string,
    shippingAddress: string,
    totalAmount: number,
    paymentDetails:{
        paymentMethod: paymentMethod,
        paymentStatus?:paymentStatus,
        pidx?:string
    },
    items: OrderDetails[]

}
export interface OrderDetails{
    quantity: number,
    productId:string
}

export enum paymentMethod{
    Cod = 'cod',
    Khalti = 'khalti'
}

export enum paymentStatus{
    Paid = 'paid',
    Unpaid = 'unpaid'
}
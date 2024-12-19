export interface IProduct {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    price: number;
}

export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
} 
import { Timestamp } from "firebase/firestore";

export interface Item {
    id: string;
    sold: number;
    name: string;
    description: string;
    price: number;
    imageURL: string;
  }

export interface ItemCart {
    id: string;
    name: string;
    price: number;
    quantity: number;
    menuItemId: string;
    imageURL: string;
}

export interface CartDetails {
    branch: string;
    cartId: string;
    createdAt: Timestamp;
    customerId: string;
    dineInOrTakeout: string;
    items: ItemCart[];
    orderNumber: number;
    status: string;
    tableNumber: number;
}

export interface MenuItemProps {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    imageURL: string;
    stock: number;
    sold: number;

    onEdit: () => void;

    onDelete: () => void;
}

export interface MenuItem {
    name: string;
    description: string;
    category: string;
    price: number;
    imageURL: string;
    stock: number;
    sold: number;
}

export interface TopMenuProps {
    id: string;
    name: string;
    sold: number;
    imageURL: string;
}

export interface SaleProps {
    yesterdaySales: number;
    todaySales: number;
    yesterdayOrders: number;
    todayOrders: number;
    yesterdayProductsSold: number;
    todayProductsSold: number;
    lastWeekSales: number;
    thisWeekSales: number;
    lastMonthSales: number;
    thisMonthSales: number;
    lastYearSales: number;
    thisYearSales: number;
    totalSales: number;
    totalProducts: number;
    totalOrders: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    mobile: string;
    role: string;
    branch: string;
    imageURL: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
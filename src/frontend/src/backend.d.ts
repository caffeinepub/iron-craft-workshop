import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PriceRecord {
    timestamp: bigint;
    price: number;
}
export interface UpdateProductInput {
    name?: string;
    unit?: string;
    isAvailable?: boolean;
    description?: string;
    imageUrl?: string;
    category?: ProductCategory;
    price?: number;
}
export interface CreateProductInput {
    name: string;
    unit: string;
    isAvailable: boolean;
    description: string;
    imageUrl?: string;
    category: ProductCategory;
    price: number;
}
export interface ContactInfo {
    mapLink: string;
    email: string;
    workingHours: string;
    address: string;
    phone: string;
}
export interface BulkPriceUpdateInput {
    productId: bigint;
    newPrice: number;
}
export type ProductId = bigint;
export interface Product {
    id: ProductId;
    name: string;
    unit: string;
    lastUpdated: bigint;
    isAvailable: boolean;
    priceHistory: Array<PriceRecord>;
    description: string;
    imageUrl?: string;
    category: ProductCategory;
    price: number;
}
export interface UserProfile {
    name: string;
}
export enum ProductCategory {
    other = "other",
    door = "door",
    gate = "gate",
    window_ = "window"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bulkUpdatePrices(updates: Array<BulkPriceUpdateInput>): Promise<void>;
    createProduct(input: CreateProductInput): Promise<ProductId>;
    deleteProduct(productId: ProductId): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactInfo(): Promise<ContactInfo | null>;
    getProduct(productId: ProductId): Promise<Product | null>;
    getProductPriceHistory(productId: ProductId): Promise<Array<PriceRecord>>;
    getProductsByCategory(category: ProductCategory): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateContactInfo(input: ContactInfo): Promise<void>;
    updateProduct(productId: ProductId, input: UpdateProductInput): Promise<void>;
}

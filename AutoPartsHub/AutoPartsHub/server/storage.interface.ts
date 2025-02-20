import session from "express-session";
import { User, Product, Category, Vendor, CartItem, Order, OrderItem, Favorite, InsertUser } from "@shared/schema";

export interface IStorage {
  sessionStore: session.Store;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getCategories(): Promise<Category[]>;

  // Cart operations
  getCartItems(userId: number): Promise<CartItem[]>;
  addToCart(userId: number, productId: number, quantity: number): Promise<CartItem>;

  // Favorite operations
  getFavorites(userId: number): Promise<Favorite[]>;
  toggleFavorite(userId: number, productId: number): Promise<void>;
}

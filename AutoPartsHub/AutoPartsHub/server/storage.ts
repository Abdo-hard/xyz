import { IStorage } from "./storage.interface";
import {
  User, Product, Category, Vendor, CartItem, Order, OrderItem, Favorite,
  InsertUser
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private categories: Map<number, Category>;
  private vendors: Map<number, Vendor>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private favorites: Map<number, Favorite>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.vendors = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.favorites = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Add sample data
    this.initSampleData();
  }

  private initSampleData() {
    // Add categories with VW-style organization
    const categories = [
      { 
        id: 1, 
        name: "Engine", 
        description: "Engine parts and components",
        imageUrl: "https://www.vwpartsvortex.com/images/2013/07/vw-engine-parts.jpg" 
      },
      { 
        id: 2, 
        name: "Transmission", 
        description: "Transmission and drivetrain components",
        imageUrl: "https://www.vwpartsvortex.com/images/2013/07/vw-transmission.jpg"
      },
      { 
        id: 3, 
        name: "Brakes & Wheel Hub", 
        description: "Brake system and wheel components",
        imageUrl: "https://www.vwpartsvortex.com/images/2013/07/vw-brakes.jpg"
      },
      { 
        id: 4, 
        name: "Suspension & Steering", 
        description: "Suspension, steering, and handling parts",
        imageUrl: "https://www.vwpartsvortex.com/images/2013/07/vw-suspension.jpg"
      },
      { 
        id: 5, 
        name: "Heating & A/C", 
        description: "Climate control components",
        imageUrl: "https://www.vwpartsvortex.com/images/2013/07/vw-hvac.jpg"
      },
      { 
        id: 6, 
        name: "Electrical", 
        description: "Electrical components and sensors",
        imageUrl: "https://www.vwpartsvortex.com/images/2013/07/vw-electrical.jpg"
      },
      { 
        id: 7, 
        name: "Body & Trim", 
        description: "Body parts and trim components",
        imageUrl: "https://www.vwpartsvortex.com/images/2013/07/vw-body.jpg"
      },
      { 
        id: 8, 
        name: "Maintenance", 
        description: "Filters, fluids, and maintenance items",
        imageUrl: "https://www.vwpartsvortex.com/images/2013/07/vw-maintenance.jpg"
      },
      { 
        id: 9, 
        name: "Air & Fuel Delivery", 
        description: "Air intake, fuel system, and related components",
        imageUrl: "https://www.vwpartsvortex.com/images/2013/07/vw-fuel.jpg"
      },
      { 
        id: 10, 
        name: "Tire & Wheel", 
        description: "Tires, wheels, and related accessories",
        imageUrl: "https://www.vwpartsvortex.com/images/2013/07/vw-wheel.jpg"
      },
      { 
        id: 11, 
        name: "Tools & Equipment", 
        description: "Specialized tools and maintenance equipment",
        imageUrl: "https://www.vwpartsvortex.com/images/2013/07/vw-tools.jpg"
      },
      { 
        id: 12, 
        name: "Accessories", 
        description: "Interior and exterior accessories",
        imageUrl: "https://www.vwpartsvortex.com/images/2013/07/vw-accessories.jpg"
      }
    ];

    categories.forEach(cat => this.categories.set(cat.id, cat));

    // Add vendors
    const vendors = [
      { id: 1, name: "Volkswagen OEM", description: "Genuine Volkswagen parts" },
      { id: 2, name: "Audi OEM", description: "Genuine Audi parts" }
    ];

    vendors.forEach(vendor => this.vendors.set(vendor.id, vendor));

    // Add products with vehicle-specific fields
    const products = [
      {
        id: 1,
        name: "Oil Filter",
        description: "Genuine VW oil filter for optimal engine protection",
        price: "12.99",
        imageUrl: "https://placehold.co/300x200",
        categoryId: 1,
        vendorId: 1,
        stock: 100,
        make: "volkswagen",
        model: "golf",
        year: "2024",
        engine: "2.0l 4-cylinder",
        transmission: "7-speed dsg"
      },
      {
        id: 2,
        name: "Brake Pads",
        description: "Front brake pads for superior stopping power",
        price: "45.99",
        imageUrl: "https://placehold.co/300x200",
        categoryId: 2,
        vendorId: 1,
        stock: 50,
        make: "volkswagen",
        model: "passat",
        year: "2023",
        engine: "2.0l tdi",
        transmission: "6-speed manual"
      },
      {
        id: 3,
        name: "DSG Transmission Fluid",
        description: "Special fluid for DSG transmissions",
        price: "89.99",
        imageUrl: "https://placehold.co/300x200",
        categoryId: 3,
        vendorId: 1,
        stock: 30,
        make: "audi",
        model: "a4",
        year: "2024",
        engine: "2.0l 4-cylinder",
        transmission: "7-speed dsg"
      },
      {
        id: 4,
        name: "Suspension Control Arm",
        description: "Front right control arm with ball joint",
        price: "129.99",
        imageUrl: "https://placehold.co/300x200",
        categoryId: 4,
        vendorId: 2,
        stock: 20,
        make: "audi",
        model: "q5",
        year: "2023",
        engine: "3.0l v6",
        transmission: "8-speed automatic"
      }
    ];

    products.forEach(product => this.products.set(product.id, product));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      item => item.userId === userId
    );
  }

  async addToCart(userId: number, productId: number, quantity: number): Promise<CartItem> {
    const id = this.currentId++;
    const cartItem = { id, userId, productId, quantity };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async getFavorites(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(
      fav => fav.userId === userId
    );
  }

  async toggleFavorite(userId: number, productId: number): Promise<void> {
    const existing = Array.from(this.favorites.values()).find(
      fav => fav.userId === userId && fav.productId === productId
    );

    if (existing) {
      this.favorites.delete(existing.id);
    } else {
      const id = this.currentId++;
      this.favorites.set(id, { id, userId, productId });
    }
  }
}

export const storage = new MemStorage();
import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/categories", async (_req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const items = await storage.getCartItems(req.user!.id);
    res.json(items);
  });

  app.post("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const item = await storage.addToCart(
      req.user!.id,
      req.body.productId,
      req.body.quantity
    );
    res.json(item);
  });

  app.get("/api/favorites", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const favorites = await storage.getFavorites(req.user!.id);
    res.json(favorites);
  });

  app.post("/api/favorites/toggle", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.toggleFavorite(req.user!.id, req.body.productId);
    res.sendStatus(200);
  });

  const httpServer = createServer(app);
  return httpServer;
}

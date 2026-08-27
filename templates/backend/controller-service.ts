import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// 1. Validation Schema
export const CreateItemDto = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
  category: z.string(),
});

export type CreateItemInput = z.infer<typeof CreateItemDto>;

// 2. Service Layer (Pure Business Logic)
export class ItemService {
  async getAllItems() {
    // Call database repository
    return [{ id: '1', name: 'Sample Item', price: 99.99 }];
  }

  async createItem(input: CreateItemInput) {
    // Process creation & persistence
    return { id: '2', ...input, createdAt: new Date() };
  }
}

// 3. Controller Layer (HTTP Handling Only)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.itemService.getAllItems();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedInput = CreateItemDto.parse(req.body);
      const data = await this.itemService.createItem(validatedInput);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };
}

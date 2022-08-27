import { Page as PagePrisma } from ".prisma/client";
import { Page } from "../entities/Page";
import { prisma } from "../prisma";
import { BaseRepository } from "./base/Base";

export class PageRepositoryPrisma extends BaseRepository<number, Page> {
  create(item: Page): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  update(id: number, item: Page): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  delete(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  find(item: Page): Promise<Page[]> {
    throw new Error("Method not implemented.");
  }
  async findOne(id: number): Promise<Page | null> {
    const result: PagePrisma | null = await prisma.page.findUnique({
      where: { id: id },
    });

    return result ? { name: result.url } : null;
  }
}

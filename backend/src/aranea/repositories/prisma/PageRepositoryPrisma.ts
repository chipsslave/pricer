import { Page as PagePrisma } from ".prisma/client";
import { PrismaClient } from "@prisma/client";
import { BaseRepository } from "../../base/BaseRepository";
import { Page } from "../../entities/Page";

export class PageRepositoryPrisma implements BaseRepository<number, Page> {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async findAll(): Promise<Page[]> {
    const results: PagePrisma[] = await this.prismaClient.page.findMany();

    return results.map((page) => ({ id: page.id, url: page.url }));
  }
  findOne(id: number): Promise<Page | null> {
    throw new Error("Method not implemented.");
  }
  create(item: Page): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  update(id: number, item: Page): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  delete(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

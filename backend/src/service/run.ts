import { Run } from ".prisma/client";
import { prisma } from "../prisma";
import { StorePage } from "./page.service";

export class RunService {
  storePage: StorePage;
  job: Run;

  constructor(storePage: StorePage) {
    this.storePage = storePage;
  }
  async startRun(): Promise<void> {
    this.job = await prisma.run.create({
      data: { pageId: this.storePage.id },
    });
  }
  async finishRun(): Promise<void> {
    await prisma.run.update({
      data: {
        finishedAt: new Date(),
      },
      where: {
        id: this.job.id,
      },
    });
  }
  recordAssignment(): void {
    throw new Error("Method not implemented.");
  }
}

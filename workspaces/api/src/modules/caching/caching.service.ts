import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache as CacheType } from "cache-manager";

@Injectable()
export class CachingService {
  constructor(@Inject(CACHE_MANAGER) private cache: CacheType) {}

  async setUserOnline(developerId: string, gateway: string) {
    await this.cache.set(gateway + developerId, 1);
  }

  async setUserOffline(developerId: string, gateway: string) {
    await this.cache.del(gateway + developerId);
  }

  async checkUserOnline(developerId: string, gateway: string) {
    const record = await this.cache.get(gateway + developerId);
    if (record) return record as string | undefined;
    else return null;
  }

  async getProjectInfoFromCache(projectId: string) {
    const record = await this.cache.get("ticket-info" + projectId);
    if (record) return JSON.parse(record as string);
    else return null;
  }

  async writeTicketListInfoToCache(ticketListInfo: any, projectId: string) {
    await this.cache.set(
      "ticket-info" + projectId,
      JSON.stringify(ticketListInfo),
      3600
    );
  }

  async updateTicketList(ticketListInfo: any, projectId: string) {
    const inCache = await this.cache.get<string>("ticket-info" + projectId);

    if (inCache) {
      const asObject: any[] = JSON.parse(inCache);
      const index = asObject.findIndex((x) => x.id == ticketListInfo.id);
      if (index > -1) {
        asObject[index] = ticketListInfo;
      }
      await this.cache.set(
        "ticket-info" + projectId,
        JSON.stringify(asObject),
        3600
      );
    }
  }

  async updateTicket(ticketListId: string, ticketInfo: any, projectId: string) {
    const inCache = await this.cache.get<string>("ticket-info" + projectId);

    if (inCache) {
      const asObject: any[] = JSON.parse(inCache);
      const listIndex = asObject.findIndex((x) => x.id == ticketListId);
      if (listIndex > -1) {
        const ticketIndex = asObject[listIndex].tickets.findIndex(
          (x) => x.id == ticketInfo.id
        );
        if (ticketIndex > -1) {
          asObject[listIndex].tickets[ticketIndex] = ticketInfo;
        }
      }
      await this.cache.set(
        "ticket-info" + projectId,
        JSON.stringify(asObject),
        3600
      );
    }
  }

  async writeChannelInfoToCache(channelId: string, channelInfo: any) {
    await this.cache.set(
      "channel-info" + channelId,
      JSON.stringify(channelInfo),
      3600
    );
  }

  async getChannelInfoFromCache(channelId: string) {
    const record = await this.cache.get("channel-info" + channelId);
    if (record) return JSON.parse(record as string);
    else return null;
  }

  async addMessageToChannel(channelId: string, newMessageInfo: any) {
    const inCache = await this.cache.get<string>("channel-info" + channelId);

    if (inCache) {
      const asObject: any = JSON.parse(inCache);
      asObject.messages.push(newMessageInfo);
      await this.cache.set(
        "channel-info" + channelId,
        JSON.stringify(asObject),
        3600
      );
    }
  }
}

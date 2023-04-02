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
}

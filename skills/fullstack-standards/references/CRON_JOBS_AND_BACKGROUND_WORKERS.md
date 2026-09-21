# ⏱️ Background Schedulers & Cron Jobs Architecture

*Standard patterns for periodic background tasks, market price syncing, subscription checks, and notifications.*

---

## 1. Clean Scheduler Structure

Never place cron execution logic directly inside server boot files (`app.ts` / `index.ts`). Group all recurring tasks inside a dedicated `scheduler.service.ts`:

```typescript
import cron from 'node-cron';
import { logger } from '../utils/logger';
import { MarketPriceService } from './marketPrice.service';
import { SubscriptionService } from './subscription.service';

export class SchedulerService {
  constructor(
    private readonly marketPriceService: MarketPriceService,
    private readonly subscriptionService: SubscriptionService
  ) {}

  public init() {
    logger.info('⏰ Initializing Background Schedulers...');

    // 1. Sync Live Gold & Exchange Rates (Every 15 minutes during market hours)
    cron.schedule('*/15 * * * *', async () => {
      try {
        await this.marketPriceService.syncLatestRates();
      } catch (err) {
        logger.error('Error syncing market rates in cron:', err);
      }
    });

    // 2. Daily Subscription Status & Expired Grace Period Checks (Every midnight)
    cron.schedule('0 0 * * *', async () => {
      try {
        await this.subscriptionService.checkExpiredSubscriptions();
      } catch (err) {
        logger.error('Error checking subscriptions in cron:', err);
      }
    });
  }
}
```

---

## 2. Best Practices for Production Schedulers
1. **Error Isolation**: Always wrap individual job callbacks in `try/catch` to ensure one failed job does not crash the server process or abort other schedulers.
2. **Distributed Locks (Redis)**: If running multiple backend instances (EC2 autoscaling, Kubernetes pods), use a distributed lock (e.g. `redlock`) or a dedicated worker queue (BullMQ) so a cron task is not executed multiple times simultaneously.
3. **Execution Time Logging**: Log start and finish timestamps with performance metrics to identify slow or blocking tasks.

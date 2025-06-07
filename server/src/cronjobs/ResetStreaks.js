import cron from "node-cron";
import { db } from "../db/index.js";
import moment from "moment";

// Cron: Every minute
cron.schedule("* * * * *", () => {
  console.log("Hello");
});

// Cron: Every day at midnight
cron.schedule("0 0 * * *", () => {
  (async () => {
    const yesterday = moment().subtract(1, "day").startOf("day").toDate();
    try {
      const usersToReset = await db.user.findMany({
        where: {
          lastActive: {
            lt: yesterday,
          },
          streak: {
            gt: 0,
          },
        },
      });

      console.log("Resetting streaks...");

      for (const user of usersToReset) {
        await db.user.update({
          where: { id: user.id },
          data: { streak: 0 },
        });
      }
    } catch (error) {
      console.error("Failed cron job:", error);
    }
  })();
});

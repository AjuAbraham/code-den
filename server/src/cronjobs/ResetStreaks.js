import cron from "node-cron";
import { db } from "../db/index.js";
import moment from "moment";

cron.schedule("0 0 * * * ", async () => {
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
    console.log("here");
    if (usersToReset.length > 0) {
      for (const user of usersToReset) {
        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            streak: 0,
          },
        });
      }
    }
  } catch (error) {
    console.log("failed cron job ", error);
    return;
  }
});

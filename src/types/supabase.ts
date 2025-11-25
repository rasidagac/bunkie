import type { MergeDeep } from "type-fest";

import type { Database as DatabaseGenerated } from "@/database.types";
export * from "@/database.types";

export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Views: {
        group_balances: {
          Row: {
            balance: number;
            group_id: string;
            user_id: string;
          };
        };
      };
    };
  }
>;

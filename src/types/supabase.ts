export type Database = {
  public: {
    CompositeTypes: {
      [_ in never]: never;
    };
    Enums: {
      currency_enum: "EUR" | "TRY" | "USD";
      split_type_enum: "custom" | "equal" | "percentage";
    };
    Functions: {
      [_ in never]: never;
    };
    Tables: {
      expense_splits: {
        Insert: {
          amount: number;
          expense_id?: string;
          id?: string;
          is_settled?: boolean;
          percentage?: null | number;
          user_id?: string;
        };
        Relationships: [
          {
            columns: ["expense_id"];
            foreignKeyName: "expense_splits_expense_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "expenses";
          },
          {
            columns: ["user_id"];
            foreignKeyName: "expense_splits_user_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
        ];
        Row: {
          amount: number;
          expense_id: string;
          id: string;
          is_settled: boolean;
          percentage: null | number;
          user_id: string;
        };
        Update: {
          amount?: number;
          expense_id?: string;
          id?: string;
          is_settled?: boolean;
          percentage?: null | number;
          user_id?: string;
        };
      };
      expenses: {
        Insert: {
          amount: number;
          created_at?: string;
          currency?: Database["public"]["Enums"]["currency_enum"];
          group_id?: string;
          id?: string;
          image_url?: null | string;
          split_type?: Database["public"]["Enums"]["split_type_enum"];
          title: string;
          user_id?: string;
        };
        Relationships: [
          {
            columns: ["group_id"];
            foreignKeyName: "expenses_group_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "groups";
          },
          {
            columns: ["user_id"];
            foreignKeyName: "expenses_user_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
        ];
        Row: {
          amount: number;
          created_at: string;
          currency: Database["public"]["Enums"]["currency_enum"];
          group_id: string;
          id: string;
          image_url: null | string;
          split_type: Database["public"]["Enums"]["split_type_enum"];
          title: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          currency?: Database["public"]["Enums"]["currency_enum"];
          group_id?: string;
          id?: string;
          image_url?: null | string;
          split_type?: Database["public"]["Enums"]["split_type_enum"];
          title?: string;
          user_id?: string;
        };
      };
      groups: {
        Insert: {
          code?: string;
          created_at?: string;
          id?: string;
          name: string;
        };
        Relationships: [];
        Row: {
          code: string;
          created_at: string;
          id: string;
          name: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          id?: string;
          name?: string;
        };
      };
      memberships: {
        Insert: {
          created_at?: string;
          group_id?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            columns: ["group_id"];
            foreignKeyName: "house_users_group_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "groups";
          },
          {
            columns: ["user_id"];
            foreignKeyName: "house_users_user_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
        ];
        Row: {
          created_at: string;
          group_id: string;
          id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          group_id?: string;
          id?: string;
          user_id?: string;
        };
      };
      payments: {
        Insert: {
          amount: number;
          created_at?: string;
          currency?: string;
          group_id?: string;
          id?: string;
          payer_id?: string;
          receiver_id?: string;
        };
        Relationships: [
          {
            columns: ["group_id"];
            foreignKeyName: "payments_group_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "groups";
          },
          {
            columns: ["payer_id"];
            foreignKeyName: "payments_payer_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
          {
            columns: ["receiver_id"];
            foreignKeyName: "payments_receiver_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
        ];
        Row: {
          amount: number;
          created_at: string;
          currency: string;
          group_id: string;
          id: string;
          payer_id: string;
          receiver_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          currency?: string;
          group_id?: string;
          id?: string;
          payer_id?: string;
          receiver_id?: string;
        };
      };
      profiles: {
        Insert: {
          avatar_url?: null | string;
          created_at?: string;
          email?: null | string;
          full_name?: null | string;
          id: string;
          is_active?: boolean;
          updated_at?: null | string;
          username?: null | string;
        };
        Relationships: [];
        Row: {
          avatar_url: null | string;
          created_at: string;
          email: null | string;
          full_name: null | string;
          id: string;
          is_active: boolean;
          updated_at: null | string;
          username: null | string;
        };
        Update: {
          avatar_url?: null | string;
          created_at?: string;
          email?: null | string;
          full_name?: null | string;
          id?: string;
          is_active?: boolean;
          updated_at?: null | string;
          username?: null | string;
        };
      };
    };
    Views: {
      group_balances: {
        Relationships: [];
        Row: {
          balance: null | number;
          group_id: null | string;
          user_id: null | string;
        };
      };
      user_balances: {
        Relationships: [
          {
            columns: ["debtor"];
            foreignKeyName: "expense_splits_user_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
          {
            columns: ["group_id"];
            foreignKeyName: "expenses_group_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "groups";
          },
          {
            columns: ["creditor"];
            foreignKeyName: "expenses_user_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
        ];
        Row: {
          amount: null | number;
          creditor: null | string;
          debtor: null | string;
          group_id: null | string;
          id: null | number;
        };
      };
    };
  };
};

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | { schema: keyof Database }
    | keyof DefaultSchema["Enums"],
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type Json =
  | { [key: string]: Json | undefined }
  | boolean
  | Json[]
  | null
  | number
  | string;

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | { schema: keyof Database }
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]),
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | { schema: keyof Database }
    | keyof DefaultSchema["Tables"],
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | { schema: keyof Database }
    | keyof DefaultSchema["Tables"],
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

type DefaultSchema = Database[Extract<keyof Database, "public">];

export const Constants = {
  public: {
    Enums: {
      currency_enum: ["TRY", "USD", "EUR"],
      split_type_enum: ["equal", "custom", "percentage"],
    },
  },
} as const;

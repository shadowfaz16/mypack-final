export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      branches: {
        Row: {
          id: string
          name: string
          address: string
          city: string
          state: string
          phone: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          city: string
          state: string
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          city?: string
          state?: string
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          clerk_id: string
          email: string
          role: 'cliente' | 'empleado' | 'admin'
          branch_id: string | null
          full_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_id: string
          email: string
          role?: 'cliente' | 'empleado' | 'admin'
          branch_id?: string | null
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_id?: string
          email?: string
          role?: 'cliente' | 'empleado' | 'admin'
          branch_id?: string | null
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_branch_id_fkey"
            columns: ["branch_id"]
            referencedRelation: "branches"
            referencedColumns: ["id"]
          }
        ]
      }
      routes: {
        Row: {
          id: string
          name: string
          states: Json
          description: string | null
          estimated_days: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          states: Json
          description?: string | null
          estimated_days?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          states?: Json
          description?: string | null
          estimated_days?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          id: string
          tracking_number: string
          user_id: string
          customer_destination: string
          route_id: string | null
          current_status: string | null
          current_status_index: number
          assignment_status: 'pending_assignment' | 'assigned' | 'active' | 'completed'
          dimensions: Json | null
          weight: number
          declared_value: number | null
          insurance_purchased: boolean
          insurance_cost: number
          service_cost: number
          total_cost: number
          destination_address: string
          destination_city: string
          destination_state: string
          destination_zipcode: string | null
          qr_code_url: string | null
          guide_pdf_url: string | null
          payment_intent_id: string | null
          payment_status: 'pending' | 'paid' | 'failed'
          created_at: string
          assigned_at: string | null
          estimated_delivery: string | null
          actual_delivery: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          tracking_number: string
          user_id: string
          customer_destination: string
          route_id?: string | null
          current_status?: string | null
          current_status_index?: number
          assignment_status?: 'pending_assignment' | 'assigned' | 'active' | 'completed'
          dimensions?: Json | null
          weight: number
          declared_value?: number | null
          insurance_purchased?: boolean
          insurance_cost?: number
          service_cost: number
          total_cost: number
          destination_address: string
          destination_city: string
          destination_state: string
          destination_zipcode?: string | null
          qr_code_url?: string | null
          guide_pdf_url?: string | null
          payment_intent_id?: string | null
          payment_status?: 'pending' | 'paid' | 'failed'
          created_at?: string
          assigned_at?: string | null
          estimated_delivery?: string | null
          actual_delivery?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          tracking_number?: string
          user_id?: string
          customer_destination?: string
          route_id?: string | null
          current_status?: string | null
          current_status_index?: number
          assignment_status?: 'pending_assignment' | 'assigned' | 'active' | 'completed'
          dimensions?: Json | null
          weight?: number
          declared_value?: number | null
          insurance_purchased?: boolean
          insurance_cost?: number
          service_cost?: number
          total_cost?: number
          destination_address?: string
          destination_city?: string
          destination_state?: string
          destination_zipcode?: string | null
          qr_code_url?: string | null
          guide_pdf_url?: string | null
          payment_intent_id?: string | null
          payment_status?: 'pending' | 'paid' | 'failed'
          created_at?: string
          assigned_at?: string | null
          estimated_delivery?: string | null
          actual_delivery?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_route_id_fkey"
            columns: ["route_id"]
            referencedRelation: "routes"
            referencedColumns: ["id"]
          }
        ]
      }
      status_updates: {
        Row: {
          id: string
          shipment_id: string
          status: string
          timestamp: string
          location: string | null
          notes: string | null
          updated_by: string | null
          update_type: 'automatic' | 'manual' | 'qr_scan'
        }
        Insert: {
          id?: string
          shipment_id: string
          status: string
          timestamp?: string
          location?: string | null
          notes?: string | null
          updated_by?: string | null
          update_type?: 'automatic' | 'manual' | 'qr_scan'
        }
        Update: {
          id?: string
          shipment_id?: string
          status?: string
          timestamp?: string
          location?: string | null
          notes?: string | null
          updated_by?: string | null
          update_type?: 'automatic' | 'manual' | 'qr_scan'
        }
        Relationships: [
          {
            foreignKeyName: "status_updates_shipment_id_fkey"
            columns: ["shipment_id"]
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "status_updates_updated_by_fkey"
            columns: ["updated_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      pricing_rules: {
        Row: {
          id: string
          service_type: 'menudeo' | 'mayoreo'
          min_weight: number
          max_weight: number
          base_price: number
          price_per_kg: number
          destination_zone: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          service_type: 'menudeo' | 'mayoreo'
          min_weight: number
          max_weight: number
          base_price: number
          price_per_kg: number
          destination_zone: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          service_type?: 'menudeo' | 'mayoreo'
          min_weight?: number
          max_weight?: number
          base_price?: number
          price_per_kg?: number
          destination_zone?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      insurance_rates: {
        Row: {
          id: string
          min_value: number
          max_value: number
          rate_percentage: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          min_value: number
          max_value: number
          rate_percentage: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          min_value?: number
          max_value?: number
          rate_percentage?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'cliente' | 'empleado' | 'admin'
      assignment_status: 'pending_assignment' | 'assigned' | 'active' | 'completed'
      payment_status: 'pending' | 'paid' | 'failed'
      update_type: 'automatic' | 'manual' | 'qr_scan'
      service_type: 'menudeo' | 'mayoreo'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

// Helper types for easier usage
export type User = Tables<'users'>
export type UserInsert = TablesInsert<'users'>
export type UserUpdate = TablesUpdate<'users'>

export type Branch = Tables<'branches'>
export type BranchInsert = TablesInsert<'branches'>
export type BranchUpdate = TablesUpdate<'branches'>

export type Route = Tables<'routes'>
export type RouteInsert = TablesInsert<'routes'>
export type RouteUpdate = TablesUpdate<'routes'>

export type Shipment = Tables<'shipments'>
export type ShipmentInsert = TablesInsert<'shipments'>
export type ShipmentUpdate = TablesUpdate<'shipments'>

export type StatusUpdate = Tables<'status_updates'>
export type StatusUpdateInsert = TablesInsert<'status_updates'>
export type StatusUpdateUpdate = TablesUpdate<'status_updates'>

export type PricingRule = Tables<'pricing_rules'>
export type PricingRuleInsert = TablesInsert<'pricing_rules'>
export type PricingRuleUpdate = TablesUpdate<'pricing_rules'>

export type InsuranceRate = Tables<'insurance_rates'>
export type InsuranceRateInsert = TablesInsert<'insurance_rates'>
export type InsuranceRateUpdate = TablesUpdate<'insurance_rates'>

// Interfaces for structured data
export interface ShipmentDimensions {
  length: number // cm
  width: number  // cm
  height: number // cm
}

export interface RouteStates {
  states: string[]
}

export type UserRole = 'cliente' | 'empleado' | 'admin'
export type AssignmentStatus = 'pending_assignment' | 'assigned' | 'active' | 'completed'
export type PaymentStatus = 'pending' | 'paid' | 'failed'
export type UpdateType = 'automatic' | 'manual' | 'qr_scan'
export type ServiceType = 'menudeo' | 'mayoreo'

// Extended types for use in components
export interface ShipmentWithRelations extends Shipment {
  route?: Route | null;
  user?: User | null;
  status_updates?: StatusUpdate[];
}

export interface UserWithStats extends User {
  totalShipments?: number;
  completedShipments?: number;
  totalSpent?: number;
}

export interface BranchWithStats extends Branch {
  employeeCount?: number;
}

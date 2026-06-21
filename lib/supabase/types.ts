export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          unit: string | null
          phone: string | null
          role: 'resident' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          unit?: string | null
          phone?: string | null
          role?: 'resident' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          unit?: string | null
          phone?: string | null
          role?: 'resident' | 'admin'
          created_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          id: string
          name: string
          category: string | null
          file_path: string
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string | null
          file_path: string
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string | null
          file_path?: string
          uploaded_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          resident_id: string
          description: string
          amount: number
          due_date: string
          status: 'pending' | 'paid' | 'verified' | 'overdue'
          receipt_path: string | null
          stripe_payment_link: string | null
          created_at: string
        }
        Insert: {
          id?: string
          resident_id: string
          description: string
          amount: number
          due_date: string
          status?: 'pending' | 'paid' | 'verified' | 'overdue'
          receipt_path?: string | null
          stripe_payment_link?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          resident_id?: string
          description?: string
          amount?: number
          due_date?: string
          status?: 'pending' | 'paid' | 'verified' | 'overdue'
          receipt_path?: string | null
          stripe_payment_link?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'payments_resident_id_fkey'
            columns: ['resident_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      requests: {
        Row: {
          id: string
          resident_id: string
          title: string
          description: string | null
          category: string | null
          status: 'aperta' | 'in_corso' | 'chiusa'
          created_at: string
        }
        Insert: {
          id?: string
          resident_id: string
          title: string
          description?: string | null
          category?: string | null
          status?: 'aperta' | 'in_corso' | 'chiusa'
          created_at?: string
        }
        Update: {
          id?: string
          resident_id?: string
          title?: string
          description?: string | null
          category?: string | null
          status?: 'aperta' | 'in_corso' | 'chiusa'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'requests_resident_id_fkey'
            columns: ['resident_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type Request = Database['public']['Tables']['requests']['Row']

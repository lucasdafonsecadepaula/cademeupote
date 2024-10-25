export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      borrowed_items: {
        Row: {
          id: string
          created_at: string
          name: string
          description?: string
          created_by: string
          sent_to?: null | string
          is_public: boolean
          has_returned: boolean
          image_name?: null | string
          lender_name: string
          lender_image_url: string
          borrower_name?: null | string
          borrower_image_url?: null | string
        }
        Insert: {
          // the data to be passed to .insert()
          id?: never
          created_at?: never
          created_by?: never
          sent_to?: never
          has_returned?: never
          borrower_name?: never
          borrower_image_url?: never

          name: string
          description?: string | null
          is_public: boolean
          image_name?: string
          lender_name: string
          lender_image_url: string
        }
        Update: {
          // the data to be passed to .update()
          id?: never
          created_at?: never
          created_by?: never
          lender_name?: never
          lender_image_url?: never
          image_name?: never

          name?: string
          description?: string
          sent_to?: string
          is_public?: boolean
          has_returned?: boolean
          borrower_name?: string
          borrower_image_url?: string
        }
      }
    }
  }
}

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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
      }
      todos: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'done'
          priority: 'p1' | 'p2' | 'p3'
          due_date: string | null
          estimated_time: number | null
          project_id: string | null
          tags: string[]
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'done'
          priority?: 'p1' | 'p2' | 'p3'
          due_date?: string | null
          estimated_time?: number | null
          project_id?: string | null
          tags?: string[]
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'done'
          priority?: 'p1' | 'p2' | 'p3'
          due_date?: string | null
          estimated_time?: number | null
          project_id?: string | null
          tags?: string[]
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          status: 'on_track' | 'at_risk' | 'blocked' | 'paused' | 'completed'
          progress: number
          owner_id: string
          team_members: string[]
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status?: 'on_track' | 'at_risk' | 'blocked' | 'paused' | 'completed'
          progress?: number
          owner_id: string
          team_members?: string[]
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: 'on_track' | 'at_risk' | 'blocked' | 'paused' | 'completed'
          progress?: number
          owner_id?: string
          team_members?: string[]
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      project_documents: {
        Row: {
          id: string
          project_id: string
          name: string
          file_path: string
          file_size: number
          mime_type: string
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          file_path: string
          file_size: number
          mime_type: string
          uploaded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          file_path?: string
          file_size?: number
          mime_type?: string
          uploaded_by?: string
          created_at?: string
        }
      }
      project_milestones: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          due_date: string
          completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          due_date: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          due_date?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      project_notes: {
        Row: {
          id: string
          project_id: string
          content: string
          author_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          content: string
          author_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          content?: string
          author_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Todo = Database['public']['Tables']['todos']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProjectDocument = Database['public']['Tables']['project_documents']['Row']
export type ProjectMilestone = Database['public']['Tables']['project_milestones']['Row']
export type ProjectNote = Database['public']['Tables']['project_notes']['Row']

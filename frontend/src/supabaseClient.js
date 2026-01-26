
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pudmsfbjbcafgebhkrgh.supabase.co'
const supabaseKey = 'sb_publishable_Lzp78t9H0mPSrlvNCr1_YQ_Zy7XGD0Q'

export const supabase = createClient(supabaseUrl, supabaseKey)

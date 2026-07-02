-- Add role column to tribe_members
ALTER TABLE public.tribe_members
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'member'
CHECK (role IN ('leader', 'member'));

-- Set existing tribe creators as leaders
UPDATE public.tribe_members tm
SET role = 'leader'
FROM public.tribes t
WHERE tm.tribe_id = t.id
  AND tm.user_id = t.created_by;

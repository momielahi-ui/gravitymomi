-- Create manual payment requests table
create table if not exists payment_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  business_id uuid references businesses not null,
  plan text not null, -- 'starter' or 'pro'
  amount numeric not null,
  payment_method text not null, -- 'payoneer' or 'nayapay'
  status text default 'pending', -- 'pending', 'approved', 'rejected'
  payment_reference text, -- Transaction ID or Email
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table payment_requests enable row level security;

-- Policy: Users can view their own requests
create policy "Users can view own payment requests"
  on payment_requests for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own requests
create policy "Users can insert own payment requests"
  on payment_requests for insert
  with check (auth.uid() = user_id);

-- Policy: Admin can view all requests (using service role or if we add admin flag later)
-- For now, we rely on backend using service role or simply bypassing RLS if needed, 
-- but ideally we'd have an admin role. 
-- Since we are building a simple admin dashboard in the same app, 
-- let's assume specific admin users exist or we check emails.
-- For simplicity in this SQL, we'll allow public insert IF authenticated (handled by "Users can insert own").

-- Create an index for faster queries
create index if not exists payment_requests_user_id_idx on payment_requests (user_id);
create index if not exists payment_requests_status_idx on payment_requests (status);

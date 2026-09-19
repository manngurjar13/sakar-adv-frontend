-- Allow a signed-in user to read their own admin_users row during login.
-- is_admin() is SECURITY DEFINER, but login should not depend on extra grants.
drop policy if exists "Users can view their own admin row" on public.admin_users;
create policy "Users can view their own admin row"
on public.admin_users
for select
using (auth.uid() = user_id);

grant execute on function public.is_admin() to anon, authenticated, service_role;

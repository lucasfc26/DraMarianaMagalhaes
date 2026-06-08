# Supabase Admin Setup

1. Aplique a migration:

```bash
supabase db push
```

2. Crie a usuária no Supabase Auth com o e-mail:

```text
staff@professionalodontosys.com.br
```

3. Cadastre a usuária como administradora usando o `id` criado no Auth:

```sql
insert into public.admin_profiles (id, email, display_name)
values ('AUTH_USER_ID_AQUI', 'staff@professionalodontosys.com.br', 'Dra. Mariana');
```

4. Configure as variáveis do frontend:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

5. Configure os secrets das Edge Functions:

```bash
supabase secrets set SUPABASE_URL=...
supabase secrets set SUPABASE_ANON_KEY=...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
supabase secrets set APP_URL=https://seu-dominio.com/admin/login
supabase secrets set SMTP_HOST=...
supabase secrets set SMTP_PORT=587
supabase secrets set SMTP_USER=staff@professionalodontosys.com.br
supabase secrets set SMTP_PASS=...
supabase secrets set SMTP_FROM=staff@professionalodontosys.com.br
```

6. Publique as funções:

```bash
supabase functions deploy reset-admin-password
supabase functions deploy complete-password-change
```

import { auth } from '@/lib/auth';

export type Variables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

export type Bindings = {
  Variables: Variables;
};

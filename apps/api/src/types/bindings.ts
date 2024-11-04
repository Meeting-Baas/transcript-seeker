import type { auth } from '@/lib/auth';

export interface Variables {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
}

export interface Bindings {
  Variables: Variables;
}

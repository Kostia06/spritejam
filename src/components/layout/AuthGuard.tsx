import type { FunctionComponent } from 'preact';
import { isAuthenticated } from '@/signals/auth';
import { useLocation } from 'preact-iso';

interface AuthGuardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: FunctionComponent<any>;
  [key: string]: unknown;
}

export function AuthGuard({ component: Component, ...rest }: AuthGuardProps) {
  const { route } = useLocation();

  if (!isAuthenticated.value) {
    route('/login');
    return null;
  }

  return <Component {...rest} />;
}

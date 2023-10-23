
// Basic Auth type
export type BasicAuth = {
  type: string;
  username: string;
  password: string;
}

// IP Headers type
export type IPHeaders = 'x-forwarded-for' | 'x-real-ip' | 'x-client-ip' | 'cf-connecting-ip' | 'fastly-client-ip' | 'x-cluster-client-ip' | 'x-forwarded' | 'forwarded-for' | 'forwarded' | 'appengine-user-ip' | 'true-client-ip' | 'cf-pseudo-ipv4';

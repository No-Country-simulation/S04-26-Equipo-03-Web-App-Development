export const setCookie = (name: string, value: string, maxAge: number = 86400) => {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export function getAdminCredentials() {
  return {
    id: process.env.VAO_ADMIN_ID ?? "",
    password: process.env.VAO_ADMIN_PASSWORD ?? "",
  };
}

export function isValidAdminCredential(id: string, password: string) {
  const configured = getAdminCredentials();
  return Boolean(configured.id && configured.password && id === configured.id && password === configured.password);
}

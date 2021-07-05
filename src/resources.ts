export const getResourceUrl = (resource: string): string =>
  process.env.NODE_ENV === "production"
    ? resource
    : `http://localhost:5000${resource}`;

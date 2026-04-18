import { z } from "zod";

const envSchema = z.object({
    VITE_API_BASE_URL: z.string().url().default("http://localhost:3000/api/v1"),
    VITE_GOOGLE_OAUTH_URL: z
        .string()
        .url()
        .default("http://localhost:3000/api/v1/auth/google"),
});

// Validate `import.meta.env`
const envParsed = envSchema.safeParse(import.meta.env);

if (!envParsed.success) {
    console.error("❌ Invalid environment variables:", envParsed.error.format());
    throw new Error("Invalid environment variables");
}

export const env = envParsed.data;

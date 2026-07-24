import bcrypt from "bcryptjs";

const users = new Map();

const normalizeEmail = (email) => email.trim().toLowerCase();

export const isFallbackMode = () => globalThis.__PUREBYTE_FALLBACK_MODE === true;

export const fallbackAuthStore = {
  async findByEmail(email) {
    const normalizedEmail = normalizeEmail(email);
    return users.get(normalizedEmail) || null;
  },

  async createUser({ name, email, password }) {
    const normalizedEmail = normalizeEmail(email);

    if (users.has(normalizedEmail)) {
      const error = new Error("User already exists");
      error.code = "USER_EXISTS";
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      email: normalizedEmail,
      password: hashedPassword,
    };

    users.set(normalizedEmail, user);
    return user;
  },

  async verifyPassword(user, password) {
    return bcrypt.compare(password, user.password);
  },
};

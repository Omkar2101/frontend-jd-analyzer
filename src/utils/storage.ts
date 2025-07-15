export class StorageService {
  private static readonly USER_EMAIL_KEY = "userEmail";

  static getUserEmail(): string | null {
    try {
      return localStorage.getItem(this.USER_EMAIL_KEY);
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  }

  static setUserEmail(email: string): boolean {
    try {
      localStorage.setItem(this.USER_EMAIL_KEY, email);
      return true;
    } catch (error) {
      console.error("Error writing to localStorage:", error);
      return false;
    }
  }

  static removeUserEmail(): boolean {
    try {
      localStorage.removeItem(this.USER_EMAIL_KEY);
      return true;
    } catch (error) {
      console.error("Error removing from localStorage:", error);
      return false;
    }
  }
}
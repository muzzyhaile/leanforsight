import { storageService } from './storageService.js';

class LocalAuthService {
  async login(email, name) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return storageService.login(email, name);
  }

  logout() {
    storageService.logout();
  }

  getCurrentUser() {
    return storageService.getCurrentUser();
  }

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }
}

export const authService = new LocalAuthService();

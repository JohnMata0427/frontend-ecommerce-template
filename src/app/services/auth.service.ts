import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly credentials = signal<string | null>(
    typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('auth_credentials') : null,
  );

  readonly isAuthenticated = computed(() => this.credentials() !== null);

  login(username: string, password: string): void {
    const encoded = btoa(`${username}:${password}`);
    this.credentials.set(encoded);
    sessionStorage.setItem('auth_credentials', encoded);
  }

  logout(): void {
    this.credentials.set(null);
    sessionStorage.removeItem('auth_credentials');
  }

  getAuthHeader(): string | null {
    const creds = this.credentials();
    return creds ? `Basic ${creds}` : null;
  }
}

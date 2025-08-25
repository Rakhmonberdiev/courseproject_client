import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorLocalizerService {
  fromStatus(status: number | undefined, url?: string): string[] {
    if (status == null) return ['common.errors.common.unknown'];

    if (status === 401 && url?.includes('/auth/login')) {
      return ['common.errors.auth.invalidCredentials'];
    }

    switch (status) {
      case 0:
        return ['common.errors.network'];
      case 400:
        return ['common.errors.badRequest'];
      case 401:
        return ['common.errors.unauthorized'];
      case 403:
        return ['common.errors.forbidden'];
      case 404:
        return ['common.errors.notFound'];
      case 409:
        return ['common.errors.conflict'];
      case 422:
        return ['common.errors.unprocessable'];
      case 429:
        return ['common.errors.tooManyRequests'];
      case 500:
        return ['common.error.server'];
      case 502:
        return ['common.errors.badGateway'];
      case 503:
        return ['common.errors.unavailable'];
      case 504:
        return ['common.errors.gatewayTimeout'];
      default:
        return ['common.errors.unknown'];
    }
  }
}

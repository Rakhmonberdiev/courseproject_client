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
        return ['common.errors.common.network'];
      case 400:
        return ['common.errors.common.badRequest'];
      case 401:
        return ['common.errors.common.unauthorized'];
      case 403:
        return ['common.errors.common.forbidden'];
      case 404:
        return ['common.errors.common.notFound'];
      case 409:
        return ['common.errors.common.conflict'];
      case 422:
        return ['common.errors.common.unprocessable'];
      case 429:
        return ['common.errors.common.tooManyRequests'];
      case 500:
        return ['common.errors.common.server'];
      case 502:
        return ['common.errors.common.badGateway'];
      case 503:
        return ['common.errors.common.unavailable'];
      case 504:
        return ['common.errors.common.gatewayTimeout'];
      default:
        return ['common.errors.common.unknown'];
    }
  }
}

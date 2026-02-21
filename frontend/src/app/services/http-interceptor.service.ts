import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  private readonly localApiBase = 'http://localhost:8080';
  private readonly productionApiBase = 'https://mykanbanboard-api.vercel.app';

  constructor(private sessionService: SessionService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let rewrittenUrl = request.url;
    const runtimeOverride = (globalThis as any)?.__KANBAN_API_BASE_URL__ as string | undefined;
    const apiBase = runtimeOverride || this.productionApiBase;

    if (!this.isLocalhost() && rewrittenUrl.startsWith(this.localApiBase)) {
      rewrittenUrl = rewrittenUrl.replace(this.localApiBase, apiBase);
    }

    const modifiedRequest = request.clone({
      url: rewrittenUrl,
      // Keep local dev behavior, but avoid cross-origin credential issues in production.
      withCredentials: this.isLocalhost()
    });

    return next.handle(modifiedRequest);
  }

  private isLocalhost(): boolean {
    const hostname = globalThis?.location?.hostname ?? '';
    return hostname === 'localhost' || hostname === '127.0.0.1';
  }
}

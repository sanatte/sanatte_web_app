import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Emotion, CreateEmotionRequest, UpdateEmotionRequest, EmotionStatus } from '../models/emotion.model';
import { ApiResponse, PaginatedResponse } from '../../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class EmotionsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/emotions`;

  getEmotions(page?: number, limit?: number, status?: EmotionStatus): Observable<PaginatedResponse<Emotion>> {
    let params = new HttpParams();
    if (page) params = params.set('page', page.toString());
    if (limit) params = params.set('limit', limit.toString());
    if (status) params = params.set('status', status);

    return this.http.get<PaginatedResponse<Emotion>>(this.baseUrl, { params });
  }

  getEmotion(id: string): Observable<ApiResponse<Emotion>> {
    return this.http.get<ApiResponse<Emotion>>(`${this.baseUrl}/${id}`);
  }

  createEmotion(data: CreateEmotionRequest): Observable<ApiResponse<Emotion>> {
    return this.http.post<ApiResponse<Emotion>>(this.baseUrl, data);
  }

  updateEmotion(id: string, data: UpdateEmotionRequest): Observable<ApiResponse<Emotion>> {
    return this.http.patch<ApiResponse<Emotion>>(`${this.baseUrl}/${id}`, data);
  }

  deleteEmotion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  activateEmotion(id: string): Observable<ApiResponse<Emotion>> {
    return this.http.patch<ApiResponse<Emotion>>(`${this.baseUrl}/${id}/activate`, {});
  }

  deactivateEmotion(id: string): Observable<ApiResponse<Emotion>> {
    return this.http.patch<ApiResponse<Emotion>>(`${this.baseUrl}/${id}/deactivate`, {});
  }
}

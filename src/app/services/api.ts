import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse, Character } from '../models/character';
import { Signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Api {
  // ✅ URL base para obtener personajes
  private readonly API_URL: string = 'https://rickandmortyapi.com/api/character';

  // ✅ Inyección de HttpClient usando inject()
  private readonly http = inject(HttpClient);

  // ✅ Señal privada que almacena personajes
  private readonly charactersSignal: WritableSignal<Character[]> = signal<Character[]>([]);

  // ✅ Señal pública de solo lectura para exponer el estado
  public readonly characters: Signal<Character[]> = this.charactersSignal;

  // ✅ Método para obtener todos los personajes
  public getCharacters(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.API_URL).pipe(
      tap(response => {
        this.charactersSignal.set(response.results);
      })
    );
  }

  // ✅ Método para buscar personajes por nombre
  public searchCharacters(name: string): Observable<ApiResponse> {
    if (!name.trim()) {
      return this.getCharacters(); // Si el nombre está vacío, devuelve todos
    }

    const searchUrl = `${this.API_URL}?name=${encodeURIComponent(name)}`;

    return this.http.get<ApiResponse>(searchUrl).pipe(
      tap(response => {
        this.charactersSignal.set(response.results);
      })
    );
  }
}

import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Api } from '../../services/api';
import { Character } from '../../models/character';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './character-list.html',
  styleUrls: ['./character-list.scss']
})
export class CharacterListComponent implements OnInit {
  // ✅ Inyectar el servicio Api
  private readonly api = inject(Api);

  // ✅ Conectar la señal de personajes
  public characters = this.api.characters;

  // ✅ Estado de la UI
  public searchTerm: string = '';
  public loading: boolean = false;
  public errorMessage: string = '';

  // ✅ Señal computada para saber si hay personajes cargados
  public hasCharacters = computed(() => this.characters().length > 0);

  // ✅ Cargar personajes al iniciar
  ngOnInit(): void {
    this.loadInitialCharacters();
  }

  // ✅ Método para cargar todos los personajes
  loadInitialCharacters(): void {
    this.loading = true;
    this.errorMessage = '';

    this.api.getCharacters()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          // No es necesario hacer nada más, ya que el servicio actualiza la señal
        },
        error: (err) => {
          this.errorMessage = 'Ocurrió un error al cargar los personajes.';
          console.error(err);
        }
      });
  }

  // ✅ Método para buscar personajes por nombre
  onSearch(): void {
    this.loading = true;
    this.errorMessage = '';

    this.api.searchCharacters(this.searchTerm)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          // La señal se actualiza desde el servicio
        },
        error: (err) => {
          this.errorMessage = 'No se encontraron personajes con ese nombre.';
          console.error(err);
        }
      });
  }

  // ✅ Buscar al presionar Enter
  onSearchKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}

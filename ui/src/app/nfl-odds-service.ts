import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface NflOdds {
  sport: string;
  eventId: string;
  commenceTime: string;
  bookmakerKey: string;
  bookmakerTitle: string;
  market: string;
  selection: string;
  team?: string;
  line: number | null;
  price: number;
  lastUpdate: string;
}

@Injectable({ providedIn: 'root' })
export class NflOddsService {
  private apiUrl = 'http://localhost:3000/odds/nfl/current-week';
  private http = inject(HttpClient);

  getCurrentWeekOdds(): Observable<NflOdds[]> {
    return of('hello') as unknown as Observable<NflOdds[]>;
    // return this.http.get<NflOdds[]>(this.apiUrl);
  }
}

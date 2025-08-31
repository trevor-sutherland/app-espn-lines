import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { NflOddsService } from './nfl-odds-service';
import { inject } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Subscription } from 'rxjs';
import { oddsMock } from './mocks/odds.mock';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
  imports: [RouterOutlet],

})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('app-espn-lines');
  private oddsSubscription$: Subscription = new Subscription;
  private oddsService = inject(NflOddsService);

  ngOnInit(): void {
    const oddsSubscription = {
      next: (odds: unknown) => {
        console.log('Current week NFL odds:', odds);
      },
      error: (err: unknown) => {
        console.log(oddsMock)
        console.error('Error fetching NFL odds:', err);
      }
    }
    this.oddsSubscription$ = this.oddsService.getCurrentWeekOdds().subscribe(oddsSubscription);
  }

  ngOnDestroy(): void {
      this.oddsSubscription$.unsubscribe();
  }
}

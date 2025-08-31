import { getTeamAbbr } from './../helpers/team-abbreviation';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { normalizeMocks, Event } from './pick.interface';

@Component({
  selector: 'app-pick',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pick.html',
  styleUrl: './pick.scss'
})
export class Pick implements OnInit {
  events: Event[] = [];
  loading = false;
  error: string | null = null;
  selected: { eventId: string; team: string; line: number; } | null = null;
  submitting = false;
  useMocks = true; // toggle this to switch between mocks and real API
  currentWeekEnd: Date;
  getTeamAbbr = getTeamAbbr;

  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    // Get today's date
    const today = new Date();
    // Get the day of the week (0 = Sunday, 6 = Saturday)
    const dayOfWeek = today.getDay();
    // Calculate how many days to add to get to Saturday (6)
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
    // Set currentWeekEnd to this week's Saturday
    this.currentWeekEnd = new Date(today);
    this.currentWeekEnd.setDate(today.getDate() + daysUntilSaturday + 14);
    this.currentWeekEnd.setHours(23, 59, 59, 999); // End of day

  }

  ngOnInit() {
    this.fetchEvents();
  }

  fetchEvents() {
    this.loading = true;
    if (this.useMocks) {
      this.events = this.setThisWeekEvents(normalizeMocks());
      this.loading = false;
    } else {
      this.http.get<Event[]>('http://localhost:3000/events/nfl').subscribe({
        next: (data) => {
          this.events = this.setThisWeekEvents(data);
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load events.';
          this.loading = false;
        }
      });
    }
  }

  selectPick(eventId: string, team: string, line: number) {
    this.selected = { eventId, team, line };
    console.log(this.selected)
  }

  submitPick() {
    if (!this.selected) return;
    this.submitting = true;
    const token = localStorage.getItem('jwtToken');
    console.log(token);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    this.http.post('http://localhost:3000/picks', {
      eventId: this.selected.eventId,
      team: this.selected.team,
      line: this.selected.line,
      // Add user info if needed (e.g., from JWT/localStorage)
    }, { headers }).subscribe({
      next: () => {
        this.submitting = false;
        // Redirect to picks summary page
        // this.router.navigate(['/picks-summary']);
        console.log('Pick submitted successfully');
      },
      error: (err) => {
        this.submitting = false;
        if (err.error?.message?.includes('already made a pick')) {
          this.router.navigate(['/picks-summary']);
        } else {
          this.error = err.error?.message || 'Could not submit pick.';
        }
      }
    });
  }

  setThisWeekEvents(events: Event[]): Event[] {
    const now = new Date();
    return events.filter(event => {
      const eventDate = new Date(event.commence_time);
      return eventDate >= now && eventDate <= this.currentWeekEnd;
    });
  }
}

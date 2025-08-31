import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface PickSummary {
  _id: string;
  userId: { displayName: string };
  team: string;
  line: number;
}

@Component({
  selector: 'app-picks-summary',
  templateUrl: './picks-summary.html',
  styleUrls: ['./picks-summary.scss']
})
export class PicksSummary implements OnInit {
  picks: PickSummary[] = [];

  private http = inject(HttpClient);

  ngOnInit() {
    this.http.get<PickSummary[]>('http://localhost:3000/picks/all').subscribe(data => {
      this.picks = data;
    });
  }
}

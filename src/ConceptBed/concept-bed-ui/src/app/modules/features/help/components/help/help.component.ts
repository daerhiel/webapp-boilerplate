import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  get title(): string { return this.title$.getTitle(); }

  constructor(private title$: Title) {
  }

  ngOnInit(): void {
  }
}

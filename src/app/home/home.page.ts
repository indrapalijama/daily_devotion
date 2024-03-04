import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonToggle,
  IonButtons,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonButton,
} from '@ionic/angular/standalone';
import { HomeService } from './home.service';
import { DatePipe, NgIf } from '@angular/common';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    NgIf,
    DatePipe,
    IonToggle,
    IonButtons,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonButton,
  ],
  providers: [HomeService],
})
export class HomePage implements OnInit {
  public devotionData: any;
  public render: boolean = false;
  darkMode = false;
  constructor(private service: HomeService) {}

  ngOnInit() {
    this.getTodayDevotion();
    this.checkAppMode();
  }

  async checkAppMode() {
    const check = await Preferences.get({ key: 'darkMode' });
    check.value == 'true' ? (this.darkMode = true) : (this.darkMode = false);
    document.body.classList.toggle('dark', this.darkMode);
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
    if (this.darkMode) {
      Preferences.set({ key: 'darkMode', value: 'true' });
    } else Preferences.set({ key: 'darkMode', value: 'false' });
  }

  handleRefresh(event: any) {
    this.getTodayDevotion();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  getTodayDevotion() {
    this.service.getToday().subscribe((res: IDevotion) => {
      this.devotionData = {
        Source: res.Source,
        Title: res.Title,
        Date: res.Date,
        Passage: res.Passage,
        Content: this.formatContent(res.Content),
      };
      setTimeout(() => {
        this.render = true;
      }, 500);
    });
  }

  private formatContent(content: string): string {
    const charLimit = 500;
    const contentWithLineBreaks = content.replace(
      new RegExp(`.{1,${charLimit}}(?:\\.|$)`, 'g'),
      '$&<span class="line-space"></span>'
    );

    const contentWithAdditionalBreaksBeforeFirstSpan =
      contentWithLineBreaks.replace(/<span/, '<span');

    const contentWithAdditionalBreaksBeforeSubsequentSpans =
      contentWithAdditionalBreaksBeforeFirstSpan.replace(
        /<span/g,
        '<br><br><span'
      );

    return contentWithAdditionalBreaksBeforeSubsequentSpans;
  }
}

export interface IDevotion {
  Source: string;
  Title: string;
  Date: Date;
  Passage: string;
  Content: string;
}

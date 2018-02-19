import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AccordionModule } from 'ngx-bootstrap/accordion';

import { AppComponent } from './app.component';

import { CardDetail } from "./components/CardDetail";
import { CardDeck } from './components/CardDeck';
import { CardPresent } from "./components/CardPresent";
import { TitleBar } from "./components/TitleBar";


import { CardSelectPage } from "./pages/CardSelectPage";

@NgModule({
  declarations: [
    AppComponent,
    CardDetail,
    CardDeck,
    CardPresent,
    TitleBar,
    CardSelectPage
  ],
  imports: [
    BrowserModule,
    AccordionModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    CardDetail
  ]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { JudgeListComponent } from './components/judge-list/judge-list.component';
import { JudgeFormComponent } from './components/judge-form/judge-form.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

const routes: Routes = [
  { path: '', redirectTo: '/judges', pathMatch: 'full' },
  { path: 'judges', component: JudgeListComponent },
  { path: 'judges/add', component: JudgeFormComponent },
  { path: 'judges/edit/:id', component: JudgeFormComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    JudgeListComponent,
    JudgeFormComponent,
    NavbarComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 
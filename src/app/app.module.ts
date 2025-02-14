import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { userReducer } from './state/user.reducer';
import { UserEffects } from './state/user.effects';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        
        // NgRx
        StoreModule.forRoot({ users: userReducer }),
        EffectsModule.forRoot([UserEffects]),
        StoreDevtoolsModule.instrument(),
        
        // PrimeNG
        TableModule,
        ButtonModule,
        InputTextModule,
        ConfirmDialogModule,
        TooltipModule,
        MenubarModule,
        AvatarModule,
        SidebarModule,
        SkeletonModule,
        RippleModule
    ],
    providers: [ConfirmationService],
    bootstrap: [AppComponent]
})
export class AppModule { }
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app.component';
import { ThemeService } from './core/services/theme.service';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [ThemeService]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle theme on button click', () => {
    const initialTheme = component.themeService.currentTheme();
    component.toggleTheme();
    expect(component.themeService.currentTheme()).not.toBe(initialTheme);
  });

  it('should toggle loading preview state', () => {
    expect(component.showLoadingPreview()).toBe(false);
    component.toggleLoadingPreview();
    expect(component.showLoadingPreview()).toBe(true);
  });

  it('should render brand cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-hero-card')).toBeTruthy();
    expect(compiled.querySelector('.palette-card')).toBeTruthy();
  });
});

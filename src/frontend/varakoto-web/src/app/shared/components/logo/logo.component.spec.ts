import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoComponent } from './logo.component';
import { ThemeService } from '../../../core/services/theme.service';

describe('LogoComponent', () => {
  let component: LogoComponent;
  let fixture: ComponentFixture<LogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoComponent],
      providers: [ThemeService]
    }).compileComponents();

    fixture = TestBed.createComponent(LogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create logo component', () => {
    expect(component).toBeTruthy();
  });

  it('should render VaraKoto.com brand name for primary variant', () => {
    fixture.componentRef.setInput('variant', 'primary');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-name')?.textContent).toContain('VaraKoto.com');
  });

  it('should render tagline when showTagline is true', () => {
    fixture.componentRef.setInput('showTagline', true);
    fixture.componentRef.setInput('variant', 'primary');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-tagline')?.textContent).toContain('গাড়ি ভাড়া কত?');
  });

  it('should hide brand text for icon-only variant', () => {
    fixture.componentRef.setInput('variant', 'icon-only');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.vk-logo-text')).toBeNull();
    expect(compiled.querySelector('.vk-logo-car')).toBeTruthy();
  });

  it('should adapt to dark mode', () => {
    fixture.componentRef.setInput('mode', 'dark');
    fixture.detectChanges();
    expect(component.isDark()).toBe(true);
    const container = fixture.nativeElement.querySelector('.vk-logo-container');
    expect(container.classList.contains('dark')).toBe(true);
  });
});

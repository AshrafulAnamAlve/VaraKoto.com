import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingScreenComponent } from './loading-screen.component';

describe('LoadingScreenComponent', () => {
  let component: LoadingScreenComponent;
  let fixture: ComponentFixture<LoadingScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingScreenComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create loading screen component', () => {
    expect(component).toBeTruthy();
  });

  it('should render character stage and Bengali loading messages by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.vk-character-stage')).toBeTruthy();
    expect(compiled.querySelector('.msg.m1')?.textContent).toContain('গাড়ি খুঁজছি…');
  });

  it('should render custom message when provided', () => {
    fixture.componentRef.setInput('customMessage', 'ক্যালকুলেট করা হচ্ছে…');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.custom-msg')?.textContent).toBe('ক্যালকুলেট করা হচ্ছে…');
  });

  it('should hide loading screen when active is false', () => {
    fixture.componentRef.setInput('active', false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.vk-loading-wrapper')).toBeNull();
  });
});

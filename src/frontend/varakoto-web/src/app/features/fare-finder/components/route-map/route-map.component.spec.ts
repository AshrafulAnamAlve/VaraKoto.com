import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouteMapComponent } from './route-map.component';
import { ComponentRef } from '@angular/core';

describe('RouteMapComponent', () => {
  let component: RouteMapComponent;
  let componentRef: ComponentRef<RouteMapComponent>;
  let fixture: ComponentFixture<RouteMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteMapComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RouteMapComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create and initialize the canvas', () => {
    expect(component).toBeTruthy();
    expect(component.stageRef).toBeTruthy();
    expect(component.canvasRef).toBeTruthy();
  });

  it('should format vehicle names correctly in Bengali', () => {
    componentRef.setInput('vehicle', 'bus');
    fixture.detectChanges();
    expect(component.vehicleNameBn()).toBe('বাস');

    componentRef.setInput('vehicle', 'rickshaw');
    fixture.detectChanges();
    expect(component.vehicleNameBn()).toBe('রিকশা');

    componentRef.setInput('vehicle', 'cng');
    fixture.detectChanges();
    expect(component.vehicleNameBn()).toBe('সিএনজি');

    componentRef.setInput('vehicle', 'bike');
    fixture.detectChanges();
    expect(component.vehicleNameBn()).toBe('বাইক');
  });

  it('should start route animation when from and to locations are provided', () => {
    componentRef.setInput('from', 'মিরপুর ১০');
    componentRef.setInput('to', 'ফার্মগেট');
    fixture.detectChanges();

    expect(component.isRouteActive()).toBe(true);
    expect(component.displayFrom()).toBe('মিরপুর ১০');
    expect(component.displayTo()).toBe('ফার্মগেট');
    expect(component.canvasAriaLabel()).toContain('মিরপুর ১০ থেকে ফার্মগেট');
  });

  it('should reset route when from or to is cleared', () => {
    componentRef.setInput('from', 'মিরপুর ১০');
    componentRef.setInput('to', 'ফার্মগেট');
    fixture.detectChanges();
    expect(component.isRouteActive()).toBe(true);

    componentRef.setInput('to', '');
    fixture.detectChanges();
    expect(component.isRouteActive()).toBe(false);
    expect(component.displayFrom()).toBe('');
  });

  it('should handle unmapped/custom location names deterministically without crashing', () => {
    componentRef.setInput('from', 'Custom Area A');
    componentRef.setInput('to', 'Unknown Town B');
    fixture.detectChanges();

    expect(component.isRouteActive()).toBe(true);
    expect(component.displayFrom()).toBe('Custom Area A');
    expect(component.displayTo()).toBe('Unknown Town B');
  });

  it('should clean up animation loop and resize observer on destroy', () => {
    expect(() => fixture.destroy()).not.toThrow();
  });
});

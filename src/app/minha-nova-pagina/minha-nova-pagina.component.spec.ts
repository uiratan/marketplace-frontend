import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhaNovaPaginaComponent } from './minha-nova-pagina.component';

describe('MinhaNovaPaginaComponent', () => {
  let component: MinhaNovaPaginaComponent;
  let fixture: ComponentFixture<MinhaNovaPaginaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhaNovaPaginaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinhaNovaPaginaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

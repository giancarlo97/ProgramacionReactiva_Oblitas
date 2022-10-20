import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, from, interval, map, mergeMap, observable, Observable, of, pipe } from 'rxjs';
import { Curso } from './models/curso';
import { CursoService } from './services/curso.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  cursos!: Curso[];
  cursosObservable: Observable<Curso[]>;
  suscripcion: any;
  promesa: any;
  merge$!: Observable<any>;


  constructor(
    private cursoService: CursoService
  ){
    console.log('paso 1');

    cursoService.obtenerCursosPromise().then((valor: Curso[]) => {
      console.log('El Promise' ,valor);
      this.cursos = valor;

    }).catch((error: any) => {
      console.log(error);
    })

    this.suscripcion = cursoService.obtenerCursosObservable().subscribe({
      next: (cursos: Curso[]) => {
        this.cursos = cursos;
        console.log('El Observable' ,cursos);
      },
      error: (error) => {
        console.log(error);
      }
    });
    this.cursosObservable = cursoService.obtenerCursosObservable();
    console.log('paso3');
  }

  ngOnDestroy(){
    this.suscripcion.unsubscribe();
  }

  ngOnInit(): void {
    of(this.cursos).pipe(
      map((cursos: Curso[]) => cursos.filter((curso: Curso) => curso.nombre === 'React'))
    ).subscribe((cursos) => {
      console.log('Desde el of:', cursos);
    });
    from(this.cursos).pipe(
      filter((curso: Curso) => curso.nombre === 'Angular')
    )
    .subscribe((cursos) => {
      console.log('Desde el from:', cursos);
    });    

    of(this.cursos).pipe(
      mergeMap(
        (cursos: Curso[]) => interval(1000).pipe(map(i => i + cursos[i].nombre))
      )
    ).subscribe(cursos => console.log('utilizando mergemap', cursos));

    this.merge$ = of(['aa','bb','cc','dd']).pipe(
      mergeMap(
        letras => interval(2000).pipe(
          map((i) => i + letras[i])
        )
      )
    );

    interval(2000).pipe(
      map((i) => i)
    ).subscribe((i) => console.log(i));

    of(this.cursos).pipe(
      mergeMap(
        (cursos: Curso[]) => from(this.cursos).pipe(
          map(
            (curso: Curso) => cursos.filter(c => c.nombre === curso.nombre)
          )
        )
      )
    ).subscribe(console.log);
  }

  agregarCurso(){
    let curso: Curso =
      {
        nombre: 'Python',
        comision: '32320',
        profesor: 'Giancarlo',
        fechaInicio: new Date(),
        fechaFin: new Date()
      }
    this.cursoService.agregarCurso(curso);
  }
}

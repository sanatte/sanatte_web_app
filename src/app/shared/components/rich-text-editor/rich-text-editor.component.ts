import {
  Component, ElementRef, AfterViewInit, OnDestroy, input, output, viewChild,
} from '@angular/core';
import Quill from 'quill';

/**
 * Editor de texto enriquecido (WYSIWYG) basado en Quill. Emite el contenido como
 * HTML. Se usa para escribir el cuerpo de los artículos en el admin.
 */
@Component({
  selector: 'app-rich-text-editor',
  template: `<div #editor></div>`,
})
export class RichTextEditorComponent implements AfterViewInit, OnDestroy {
  /** HTML inicial (al editar un artículo existente). */
  readonly content = input<string>('');
  /** HTML actualizado en cada cambio. */
  readonly contentChange = output<string>();

  private readonly editorEl = viewChild.required<ElementRef<HTMLDivElement>>('editor');
  private quill?: Quill;

  ngAfterViewInit(): void {
    const quill = new Quill(this.editorEl().nativeElement, {
      theme: 'snow',
      placeholder: 'Escribe el contenido del artículo…',
      modules: {
        toolbar: [
          [{ header: [2, 3, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote', 'link'],
          ['clean'],
        ],
      },
    });

    const initial = this.content();
    if (initial) quill.clipboard.dangerouslyPasteHTML(initial);

    quill.on('text-change', () => {
      const html = quill.getSemanticHTML();
      // Quill deja "<p></p>" cuando está vacío → lo normalizamos a "".
      this.contentChange.emit(html === '<p></p>' ? '' : html);
    });

    this.quill = quill;
  }

  ngOnDestroy(): void {
    this.quill = undefined;
  }
}

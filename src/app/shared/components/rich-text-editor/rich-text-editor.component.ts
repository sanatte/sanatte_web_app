import {
  Component, ElementRef, AfterViewInit, OnDestroy, input, output, viewChild,
} from '@angular/core';
import Quill from 'quill';
import { TEXTS } from '../../../core/i18n/texts';

@Component({
  selector: 'app-rich-text-editor',
  template: `<div #editor></div>`,
})
export class RichTextEditorComponent implements AfterViewInit, OnDestroy {
  readonly content = input<string>('');
  readonly contentChange = output<string>();

  private readonly editorEl = viewChild.required<ElementRef<HTMLDivElement>>('editor');
  private quill?: Quill;

  ngAfterViewInit(): void {
    const quill = new Quill(this.editorEl().nativeElement, {
      theme: 'snow',
      placeholder: TEXTS.shared.richTextEditor.placeholder,
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
      this.contentChange.emit(html === '<p></p>' ? '' : html);
    });

    this.quill = quill;
  }

  ngOnDestroy(): void {
    this.quill = undefined;
  }
}

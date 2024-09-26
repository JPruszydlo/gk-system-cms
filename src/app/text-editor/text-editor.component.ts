import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { QuillModule } from 'ngx-quill'
import Quill from 'quill'
import Parchment from 'parchment'
import { ScrollPanelModule } from 'primeng/scrollpanel'

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [QuillModule, FormsModule, ScrollPanelModule],
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.css',
})
export class TextEditorComponent implements AfterViewInit {
  @Input() editorWith: string | undefined
  @Input() text: string = ''
  @Output() editorChanged: EventEmitter<string> = new EventEmitter<string>()

  @ViewChild('editResult') editResult: ElementRef
  contentChanged(event: any) {
    this.editorChanged.emit(event.html)
  }
  ngAfterViewInit(): void {
    const fontSizeArr = [
      '8px',
      '9px',
      '10px',
      '11px',
      '12px',
      '14px',
      '16px',
      '18px',
      '20px',
      '22px',
      '24px',
      '26px',
      '28px',
      '36px',
      '48px',
      '72px',
    ]
    const Size: any = Quill.import('attributors/style/size')
    const Font: any = Quill.import('attributors/style/font')
    const Alignment: any = Quill.import('attributors/style/align')
    const Icons: any = Quill.import('ui/icons')
    let alignIcons = {
      left: '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"/></svg>',
      center: Icons.align.center,
      justify: Icons.align.justify,
      right: Icons.align.right,
    }

    Icons.align = alignIcons
    Alignment.whitelist.unshift('left')
    Size.whitelist = fontSizeArr
    Font.whitelist.push('verdana')
    Font.whitelist.push('arial')
    Quill.register(Size, true)
    Quill.register(Font, true)
    Quill.register(Alignment, true)
    Quill.register(Icons, true)
    var Parchment = Quill.import('parchment')
    var lineHeightConfig = {
      scope: Parchment.Scope.BLOCK,
      whitelist: ['1.0', '1.2', '1.4', '1.6', '2.0', '2.5', '3.0'],
    }
    var lineHeightClass = new Parchment.ClassAttributor('line-height', 'ql-line-height', lineHeightConfig)
    var lineHeightStyle = new Parchment.StyleAttributor('line-height', 'line-height', lineHeightConfig)
    Quill.register(lineHeightClass)
    Quill.register(lineHeightStyle)
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'content-theme-editor',
	templateUrl: './content-theme-editor.component.html'
})
export class ContentThemeEditorComponent implements OnInit {

	@Input()
	theme: number = 0;

	ngOnInit() {

	}
}
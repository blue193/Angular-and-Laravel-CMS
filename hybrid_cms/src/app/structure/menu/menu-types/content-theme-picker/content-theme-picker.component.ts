import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'content-theme-picker',
	templateUrl: './content-theme-picker.component.html'
})
export class ContentThemePickerComponent implements OnInit {

	@Input()
	theme: number = 0;

	@Output()
	change: EventEmitter<number> = new EventEmitter<number>();

	themePick(theme: number) {
		this.change.emit(theme);
	}

	ngOnInit() {

	}

}
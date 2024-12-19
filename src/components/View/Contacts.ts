import { IEvents } from "../base/events";

export interface IContacts {
  formContacts: HTMLFormElement;
  inputAll: HTMLInputElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;
  valid: boolean;
  error: string;
  render(): HTMLElement;
  resetForm(): void;
}

export class Contacts implements IContacts {
  formContacts: HTMLFormElement;
  inputAll: HTMLInputElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;
  private _valid: boolean = false;
  private _error: string = '';

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.formContacts = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
    this.inputAll = Array.from(this.formContacts.querySelectorAll('.form__input'));
    this.buttonSubmit = this.formContacts.querySelector('.button');
    this.formErrors = this.formContacts.querySelector('.form__errors');

    const phoneInput = this.formContacts.querySelector('input[name="phone"]') as HTMLInputElement;
    phoneInput.value = '+7';
    
    phoneInput.addEventListener('input', this.handlePhoneInput.bind(this));
    
    phoneInput.addEventListener('keydown', (e) => {
        const input = e.target as HTMLInputElement;
        if (e.key === 'Backspace' && input.selectionStart <= 2) {
            e.preventDefault();
        }
    });

    this.inputAll.forEach(item => {
        if (item.name !== 'phone') {
            item.addEventListener('input', (event) => {
                const target = event.target as HTMLInputElement;
                this.events.emit(`contacts:changeInput`, { 
                    field: target.name, 
                    value: target.value 
                });
            });
        }
    });

    this.formContacts.addEventListener('submit', (event: Event) => {
        event.preventDefault();
        this.events.emit('contacts:submit');
    });
  }

  private handlePhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart;

    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 11) {
        value = value.slice(0, 11);
    }

    let formattedNumber = '+7';
    if (value.length > 1) {
        formattedNumber += ' ' + value.slice(1, 4);
    }
    if (value.length > 4) {
        formattedNumber += ' ' + value.slice(4, 7);
    }
    if (value.length > 7) {
        formattedNumber += ' ' + value.slice(7, 9);
    }
    if (value.length > 9) {
        formattedNumber += ' ' + value.slice(9);
    }

    input.value = formattedNumber;

    this.events.emit(`contacts:changeInput`, { 
        field: input.name, 
        value: formattedNumber 
    });

    const newCursorPosition = formattedNumber.length;
    input.setSelectionRange(newCursorPosition, newCursorPosition);
  }

  get valid(): boolean {
    return this._valid;
  }

  set valid(value: boolean) {
    this._valid = value;
    this.buttonSubmit.disabled = !value;
  }

  get error(): string {
    return this._error;
  }

  set error(value: string) {
    this._error = value;
    this.formErrors.textContent = value;
  }

  render() {
    return this.formContacts
  }

  resetForm(): void {
    this.formContacts.reset();
    const phoneInput = this.formContacts.querySelector('input[name="phone"]') as HTMLInputElement;
    phoneInput.value = '+7';
    this.formErrors.textContent = '';
  }
}
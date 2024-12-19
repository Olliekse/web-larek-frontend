import { IEvents } from "../base/events";

export interface IContacts {
  formContacts: HTMLFormElement;
  inputAll: HTMLInputElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;
  render(): HTMLElement;
}

export class Contacts implements IContacts {
  formContacts: HTMLFormElement;
  inputAll: HTMLInputElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.formContacts = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
    this.inputAll = Array.from(this.formContacts.querySelectorAll('.form__input'));
    this.buttonSubmit = this.formContacts.querySelector('.button');
    this.formErrors = this.formContacts.querySelector('.form__errors');

    // Initialize phone input
    const phoneInput = this.formContacts.querySelector('input[name="phone"]') as HTMLInputElement;
    phoneInput.value = '+7';
    
    phoneInput.addEventListener('input', this.handlePhoneInput.bind(this));
    
    // Prevent deletion of +7 prefix
    phoneInput.addEventListener('keydown', (e) => {
        const input = e.target as HTMLInputElement;
        if (e.key === 'Backspace' && input.selectionStart <= 2) {
            e.preventDefault();
        }
    });

    // Handle other inputs
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
        this.events.emit('success:open');
    });
  }

  private handlePhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart;

    // Remove all non-digit characters except for the initial +7
    let value = input.value.replace(/\D/g, '');
    
    // Limit to 11 digits (including the country code)
    if (value.length > 11) {
        value = value.slice(0, 11);
    }

    // Format the phone number
    let formattedNumber = '+7';
    if (value.length > 1) {
        formattedNumber += ' ' + value.slice(1, 4); // Area code
    }
    if (value.length > 4) {
        formattedNumber += ' ' + value.slice(4, 7); // First part of the number
    }
    if (value.length > 7) {
        formattedNumber += ' ' + value.slice(7, 9); // Second part of the number
    }
    if (value.length > 9) {
        formattedNumber += ' ' + value.slice(9); // Last part of the number
    }

    input.value = formattedNumber;

    // Emit the change event with the formatted value
    this.events.emit(`contacts:changeInput`, { 
        field: input.name, 
        value: formattedNumber 
    });

    // Set the cursor position after the last entered digit
    const newCursorPosition = formattedNumber.length; // Set cursor to the end of the formatted number
    input.setSelectionRange(newCursorPosition, newCursorPosition);
  }

  set valid(value: boolean) {
    this.buttonSubmit.disabled = !value;
  }

  render() {
    return this.formContacts
  }
}
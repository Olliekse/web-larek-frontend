export function formatPhoneNumber(value: string): string {
    let digits = value.replace(/\D/g, '');
    
    if (digits.startsWith('8')) {
        digits = '7' + digits.slice(1);
    }
    digits = digits.slice(0, 11);
    
    if (digits.length === 0) return '+7';
    
    let formatted = '+7';
    if (digits.length > 1) formatted += ' ' + digits.slice(1, 4);
    if (digits.length > 4) formatted += ' ' + digits.slice(4, 7);
    if (digits.length > 7) formatted += ' ' + digits.slice(7, 9);
    if (digits.length > 9) formatted += ' ' + digits.slice(9);
    
    return formatted;
}

export function handlePhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = formatPhoneNumber(input.value);
    input.value = value;
}

export function setupPhoneInput(input: HTMLInputElement): void {
    input.value = '+7';
    
    input.addEventListener('input', handlePhoneInput);
    
    input.addEventListener('focus', () => {
        if (input.value === '') {
            input.value = '+7';
        }
    });
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.selectionStart <= 2) {
            e.preventDefault();
        }
    });
} 
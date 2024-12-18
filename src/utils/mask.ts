export function formatPhone(phone: string): string {
    const value = phone.replace(/\D+/g, '');
    const numberLength = 11;

    let result = '';

    if (value.length === 0) {
        return '';
    }

    if (value[0] === '7' || value[0] === '8') {
        result = '+7';
    } else {
        result = `+7${value[0]}`;
    }

    if (value.length > 1) {
        result += ' (' + value.substring(1, 4);
    }
    if (value.length >= 5) {
        result += ') ' + value.substring(4, 7);
    }
    if (value.length >= 8) {
        result += '-' + value.substring(7, 9);
    }
    if (value.length >= 10) {
        result += '-' + value.substring(9, 11);
    }

    return result;
}

interface fancyNumber {
    value: number;
    prefix: string;
    name: string;
}

const fancyNumbers: fancyNumber[] = [
    { value: 1e63, prefix: 'v', name: 'Vigintillion' },
    { value: 1e60, prefix: 'N', name: 'Novemdecillion' },
    { value: 1e57, prefix: 'O', name: 'Octodecillion' },
    { value: 1e54, prefix: 'St', name: 'Septendecillion' },
    { value: 1e51, prefix: 'Sd', name: 'Sexdecillion' },
    { value: 1e48, prefix: 'Qd', name: 'Quindecillion' },
    { value: 1e45, prefix: 'Qt', name: 'Quattuordecillion' },
    { value: 1e42, prefix: 'T', name: 'Tredecillion' },
    { value: 1e39, prefix: 'D', name: 'Duodecillion' },
    { value: 1e36, prefix: 'U', name: 'Undecillion' },
    { value: 1e33, prefix: 'd', name: 'Decillion' },
    { value: 1e30, prefix: 'n', name: 'Nonillion' },
    { value: 1e27, prefix: 'o', name: 'Octillion' },
    { value: 1e24, prefix: 'S', name: 'Septillion' },
    { value: 1e21, prefix: 's', name: 'Sextillion' },
    { value: 1e18, prefix: 'Q', name: 'Quintillion' },
    { value: 1e15, prefix: 'q', name: 'Quadrillion' },
    { value: 1e12, prefix: 't', name: 'Trillion' },
    { value: 1e9, prefix: 'B', name: 'Billion' },
    { value: 1e6, prefix: 'M', name: 'Million' },
    { value: 1e3, prefix: 'K', name: 'Thousand' }
];

function formatNumber(num: number) {
    for (const { value, prefix } of fancyNumbers) {
        if (num >= value) {
            return (num / value).toFixed(1) + prefix;
        }
    }
    
    return Math.floor(num).toString();
}

function parseFormattedNumber(str: string): number | null {
    if (!str || str.trim() === '') return null;
    
    // Try to parse as regular number first
    const regularNumber = parseFloat(str);
    if (!isNaN(regularNumber)) {
        return regularNumber;
    }

    // Try to parse with prefixes using fancyNumbers table
    for (const { prefix, value } of fancyNumbers) {
        const lowerStr = str.toLowerCase();
        const lowerPrefix = prefix.toLowerCase();
        if (lowerStr.endsWith(lowerPrefix)) {
            const numberPart = str.slice(0, -prefix.length);
            const num = parseFloat(numberPart);
            if (!isNaN(num)) {
                return num * value;
            }
        }
    }

    return null;
}

export const formattingUtil = {
    formatNumber,
    parseFormattedNumber
};
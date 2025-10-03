
function formatNumber(num: number) {
    const prefixes = [
        { value: 1e63, prefix: 'v' },   // Vigintillion
        { value: 1e60, prefix: 'N' },   // Novemdecillion
        { value: 1e57, prefix: 'O' },   // Octodecillion
        { value: 1e54, prefix: 'St' },  // Septendecillion
        { value: 1e51, prefix: 'Sd' },  // Sexdecillion
        { value: 1e48, prefix: 'Qd' },  // Quindecillion
        { value: 1e45, prefix: 'Qt' },  // Quattuordecillion
        { value: 1e42, prefix: 'T' },   // Tredecillion
        { value: 1e39, prefix: 'D' },   // Duodecillion
        { value: 1e36, prefix: 'U' },   // Undecillion
        { value: 1e33, prefix: 'd' },   // Decillion
        { value: 1e30, prefix: 'n' },   // Nonillion
        { value: 1e27, prefix: 'o' },   // Octillion
        { value: 1e24, prefix: 'S' },   // Septillion
        { value: 1e21, prefix: 's' },   // Sextillion
        { value: 1e18, prefix: 'Q' },   // Quintillion
        { value: 1e15, prefix: 'q' },   // Quadrillion
        { value: 1e12, prefix: 't' },   // Trillion
        { value: 1e9, prefix: 'B' },    // Billion
        { value: 1e6, prefix: 'M' },    // Million
        { value: 1e3, prefix: 'K' }     // Thousand
    ];

    for (const { value, prefix } of prefixes) {
        if (num >= value) {
            return (num / value).toFixed(1) + prefix;
        }
    }
    
    return Math.floor(num).toString();
}

function parseFormattedNumber(str: string): number | null {
    if (!str || str.trim() === '') return null;
    
    const prefixes = [
        { prefix: 'v', multiplier: 1e63 },
        { prefix: 'N', multiplier: 1e60 },
        { prefix: 'O', multiplier: 1e57 },
        { prefix: 'St', multiplier: 1e54 },
        { prefix: 'Sd', multiplier: 1e51 },
        { prefix: 'Qd', multiplier: 1e48 },
        { prefix: 'Qt', multiplier: 1e45 },
        { prefix: 'T', multiplier: 1e42 },
        { prefix: 'D', multiplier: 1e39 },
        { prefix: 'U', multiplier: 1e36 },
        { prefix: 'd', multiplier: 1e33 },
        { prefix: 'n', multiplier: 1e30 },
        { prefix: 'o', multiplier: 1e27 },
        { prefix: 'S', multiplier: 1e24 },
        { prefix: 's', multiplier: 1e21 },
        { prefix: 'Q', multiplier: 1e18 },
        { prefix: 'q', multiplier: 1e15 },
        { prefix: 't', multiplier: 1e12 },
        { prefix: 'B', multiplier: 1e9 },
        { prefix: 'M', multiplier: 1e6 },
        { prefix: 'K', multiplier: 1e3 }
    ];

    // Try to parse as regular number first
    const regularNumber = parseFloat(str);
    if (!isNaN(regularNumber)) {
        return regularNumber;
    }

    // Try to parse with prefixes
    for (const { prefix, multiplier } of prefixes) {
        const lowerStr = str.toLowerCase();
        const lowerPrefix = prefix.toLowerCase();
        if (lowerStr.endsWith(lowerPrefix)) {
            const numberPart = str.slice(0, -prefix.length);
            const num = parseFloat(numberPart);
            if (!isNaN(num)) {
                return num * multiplier;
            }
        }
    }

    return null;
}

export const formattingUtil = {
    formatNumber,
    parseFormattedNumber
};
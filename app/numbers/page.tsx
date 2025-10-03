'use client'

import { formattingUtil } from '../../utils/formattingUtil'

// We need to access the fancyNumbers table, but it's not exported
// Let's create a local copy for display purposes
const fancyNumbers = [
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

export default function NumbersPage() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Fancy Numbers</h1>
            <p className="text-gray-600 mb-8">
                This page displays all the number prefixes used in the game for formatting large numbers.
            </p>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Number Prefixes</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Prefix
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Value
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Example
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {fancyNumbers.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-lg font-mono font-bold text-blue-600">
                                            {item.prefix}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                                        {item.value.toExponential(0)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                                        {formattingUtil.formatNumber(item.value * 1.5)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">How it works</h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                    The formatting system automatically converts large numbers into more readable formats using these prefixes. 
                    For example, 1,500,000 becomes "1.5M" (Million), and 2,300,000,000 becomes "2.3B" (Billion).
                </p>
            </div>
        </div>
    )
}

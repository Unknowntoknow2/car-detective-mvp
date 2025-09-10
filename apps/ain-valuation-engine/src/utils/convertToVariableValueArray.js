export function convertToVariableValueArray(data) {
    if (!data || typeof data !== 'object')
        return [];
    return Object.entries(data).map(([key, value]) => ({
        Variable: key,
        Value: value !== null && value !== undefined ? String(value) : 'N/A',
    }));
}

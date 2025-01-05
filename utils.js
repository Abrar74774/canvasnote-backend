export const logAnyMissingParams = (body, ...fields) => {
    return fields.filter(field => !body[field]).map(field => `${field} is missing`).join('. ')
} 
import pkg from 'lodash';

const { mapKeys, camelCase } = pkg;
export const convertToCamelCase = (obj) => {
    return mapKeys(obj, (_, key) => camelCase(key));
};
export function transposeArray(data) {
    const transposed = {};
    data.forEach((item) => {
        Object.keys(item).forEach((key) => {
            if (!transposed[key]) {
                transposed[key] = [];
            }
            transposed[key].push(item[key]);
        });
    });

    const result = Object.entries(transposed).map(([key, values]) => [
        key,
        ...values,
    ]);
    const headers = result[0];

    const keyValueArray = result.slice(1).map((row) => {
        return headers.reduce((obj, header, index) => {
            obj[header] = row[index];
            return obj;
        }, {});
    });
    return keyValueArray;
}
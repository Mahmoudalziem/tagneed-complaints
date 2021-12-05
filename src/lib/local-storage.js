const store = (key, value) => localStorage.setItem(key, value)

const storeMany = (keyAndValues) => (
    keyAndValues.map(({ key, value }) => (
        localStorage.setItem(key, value)
    ))
)

const load = (key, defaultValue = null) => JSON.parse(localStorage.getItem(key));

const loadMany = (keyAndValue) => {

    let data = [];

    keyAndValue.forEach(({ key, value }) => {

        data[key] = load(key, value)
    });

    return data;
}

const clear = () => localStorage.clear();

const clearItems = (keys) => (
    keys.map(item =>
        localStorage.removeItem(item))
);

export { store, storeMany, load, loadMany, clear, clearItems };
export function importAll(r) {
    let modules = {};
    r.keys().forEach((key) => {
        if (key === './index.js') return;
        modules[key.replace(/(\.\/|\.js)/g, '')] = r(key).default;
    });
    return modules;
}
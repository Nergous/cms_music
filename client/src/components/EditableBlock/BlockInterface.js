export default class BlockInterface {
    constructor(id, type, content) {
        this.id = id;
        this.type = type;
        this.content = content;
    }

    render() {
        throw new Error('Метод render должен быть переопределен в дочернем классе');
    }
}
// Импорт необходимых ассетов из status.js
import { CONTROLLER, ASSETS } from "../status.js";

export default class Inventory extends Phaser.Scene {
    constructor() {
        super({ key: "Inventory" });
    }

    preload() {
        this.load.image('BACKGROUND_INVENTORY', ASSETS.BACKGROUND_INVENTORY);
    }

    create() {
        this.inventoryVisible = false;
        this.maxItems = 10; // Максимальное количество предметов
        this.items = []; // Массив для хранения предметов
        this.inventoryGroup = this.add.group();

        this.BACKGROUND_INVENTORY = this.add.image(400, 300, 'BACKGROUND_INVENTORY');
        this.inventoryGroup.add(this.BACKGROUND_INVENTORY);

        // Текстовые элементы для предметов
        this.itemTextGroup = this.add.group();
        this.inventoryGroup.add(this.itemTextGroup);

        // Скрытие инвентаря
        this.inventoryGroup.setVisible(false);

        // Открытие-закрытие инвентаря на клавишу I
        this.input.keyboard.on('keydown-I', () => {
            this.inventoryVisible = !this.inventoryVisible;
            this.inventoryGroup.setVisible(this.inventoryVisible);
        });
    }

    addItem(itemName) {
        if (this.items.length >= this.maxItems) {
            console.log('Inventory is full');
            return;
        }

        // Создание текстового элемента для нового предмета
        let itemText = this.add.text(350, 280 + (this.items.length * 30), itemName, { fontSize: '20px', fill: '#fff' });
        this.itemTextGroup.add(itemText);
        this.items.push(itemName);
    }
}

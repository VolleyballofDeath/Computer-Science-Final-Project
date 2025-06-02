

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer);
        });
    });
}

async function main(){
    //initialize all locations here first
    let PlaceForest00 = new place([],[],"You are Matt. You have just awoken in an enchanted forest filled to the brim with mystical creatures and fantasies. You remember nothing of how you arrived here, nor your life before the forest. All you have is a rusty sword, and all you know is that you feel a creeping danger here, and you must escape as quickly as possible. Understood?","Starting Location");
    let PlaceForest01 = new place([new enemy_slime(),new enemy_slime()],[new item_blackberry(4)],"you come across a secluded grove","the forest grove");
    let PlaceForest02 = new place([new enemy_slime_large(), new enemy_slime()],[new item_blackberry(10), new item_wool_coat(1)],"you stumble into a larger clearing, and see the twin moons abovehead","moonlit clearing");
    // intialize all the links between locations
    PlaceForest00.links = [PlaceForest01];
    PlaceForest01.links = [PlaceForest00,PlaceForest02];
    PlaceForest02.links = [PlaceForest01];
    // starting initalizations

    Matt.place = PlaceForest00;
    Matt.heldWeapon = 0;

    console.log(Matt.place.desc)
    while (true) {
    if (Matt.place.enemies.length === 0) {
        addLootToInventory(Matt.place)
        Matt.place.loot = [];
        let input = await ask("What do you want to do? (move, inventory, consume, quit): ");

        if (input === "move") {
            await move();
        } else if (input === "inventory") {
            printInventory();
        } else if (input === "consume") {
            console.log("Inventory:");
            for (let i = 0; i < Matt.inventory.length; i++) {
                console.log("[" + i + "] " + Matt.inventory[i].desc + " x" + Matt.inventory[i].ammount);
            }
            let choice = await ask("Which item number do you want to consume? ");
            let index = Number(choice);

            if (isNaN(index) || index < 0 || index >= Matt.inventory.length) {
                console.log("Invalid selection.");
            } else {
                consume(Matt.inventory[index]);
            }
        } else if (input === "quit") {
            console.log("Goodbye!");
            rl.close();
            break;
        } else {
            console.log("Unknown command.");
        }
    } else {
        await fight();
    }
}
}
async function move() {
    let currentPlace = Matt.place;
    console.log("Your options are:");
    for (let i = 0; i < currentPlace.links.length; i++) {
        console.log("- " + currentPlace.links[i].name);
    }

    while (true) {
        let input = await ask("Where do you want to go? (case sensitive): ");
        for (let i = 0; i < currentPlace.links.length; i++) {
            if (input === currentPlace.links[i].name) {
                Matt.place = currentPlace.links[i];
                console.log("You moved to " + Matt.place.name + ".");
                console.log(Matt.place.desc);
                return;
            }
        }
        console.log("Invalid location. Try again.");
    }
}
async function fight() {
    let enemies = Matt.place.enemies;

    console.log("Enemies here:");
    for (let i = 0; i < enemies.length; i++) {
        console.log("[" + i + "] " + enemies[i].desc + " (HP: " + enemies[i].health.toFixed(1) + ")");
    }

    // Automatically select the best weapon
    Matt.heldWeapon = getBestWeapon();
    let playerAttack = Matt.inventory[Matt.heldWeapon].attack;

    // Choose an enemy to attack
    let input = await ask("Choose an enemy to attack by number: ");
    let index = Number(input);

    if (isNaN(index) || index < 0 || index >= enemies.length) {
        console.log("Invalid selection.");
        return;
    }

    let enemy = enemies[index];

    console.log("You attack the " + enemy.desc + " with the " + Matt.inventory[Matt.heldWeapon].desc + "!");
    atackOnEnemy(enemy);

    if (enemy.health <= 0) {
        console.log("You defeated the " + enemy.desc + "!");
        for (let i = 0; i < enemy.drops.length; i++) {
            Matt.inventory.push(enemy.drops[i]);
        }
        mergeInventoryItems();
        enemies.splice(index, 1); 
        return;
    }

    console.log("The " + enemy.desc + " strikes back!");

    // Automatically select the best armor
    let bestArmorIndex = getBestArmor();
    let playerDefense = Matt.inventory[bestArmorIndex].defense;
    
    atackOnPlayer(enemy);

    if (Matt.health <= 0) {
        console.log("You were defeated...");
        rl.close();
        process.exit();
    } else {
        console.log("Your health: " + Matt.health + "/" + Matt.maxhealth);
    }
}
// Function to get the best weapon
function getBestWeapon() {
    let bestWeaponIndex = -1;
    let highestAttack = 0;

    // Loop through inventory to find the best weapon
    for (let i = 0; i < Matt.inventory.length; i++) {
        let item = Matt.inventory[i];

        if (item.attack && item.attack > highestAttack) {
            highestAttack = item.attack;
            bestWeaponIndex = i;
        }
    }

    return bestWeaponIndex;
}

// Function to get the best armor
function getBestArmor() {
    let bestArmorIndex = -1;
    let highestDefense = 0;

    // Loop through inventory to find the best armor
    for (let i = 0; i < Matt.inventory.length; i++) {
        let item = Matt.inventory[i];

        if (item.defense && item.defense > highestDefense) {
            highestDefense = item.defense;
            bestArmorIndex = i;
        }
    }

    return bestArmorIndex;
}
function printInventory(){
    answer = ""
    for (let i = 0; i < Matt.inventory.length; i++){
        answer+=Matt.inventory[i].desc+"x"+Matt.inventory[i].ammount+","
    }
    console.log(answer);
}
function addLootToInventory(place) {
 
    if (place.loot.length > 0) {
        console.log("You found some loot!");
        for (let i = 0; i < place.loot.length; i++) {
            Matt.inventory.push(place.loot[i]);
        }
        mergeInventoryItems(); 
        console.log("Loot added to your inventory.");
    }
}
function consume(item){
    if(item.ammount >= 1){
 
        if (item.food && item.food > 0) {
            if (Matt.health < Matt.maxhealth) {
                Matt.health += item.food;
                if (Matt.health > Matt.maxhealth) {
                    Matt.health = Matt.maxhealth;
                }
                item.ammount -= 1;
                console.log("You consumed " + item.desc + ". Your health is now " + Matt.health + "/" + Matt.maxhealth + ".");
 
                if (item.ammount === 0) {
                    let index = Matt.inventory.indexOf(item);
                    if (index > -1) {
                        Matt.inventory.splice(index, 1);
                        console.log("You have used up all of the " + item.desc + ".");
                    }
                }
            } else {
                console.log("You are too full to eat.");
            }
        } else {
            console.log("This item has no food value or is not consumable.");
        }
    } else {
        console.log("You don't have that item.");
    }
}
function mergeInventoryItems() {
    
    let itemMap = new Map();
    Matt.inventory.forEach(item => {
        if (itemMap.has(item.desc)) {
            let existingItem = itemMap.get(item.desc);
            existingItem.ammount = truncate(existingItem.ammount + item.ammount);
        } else {
            itemMap.set(item.desc, item);
        }
    });

    Matt.inventory = Array.from(itemMap.values());
}

function truncate(amount, decimals = 2) {
    return Math.trunc(amount * 10 ** decimals) / 10 ** decimals;
}

function atackOnEnemy(enemy) {
    let playerAttack = Matt.inventory[Matt.heldWeapon].attack;
    if(enemy.defense<= playerAttack){
    enemy.health -= (playerAttack-enemy.defense);
    }
}
function atackOnPlayer(enemy) {
    let playerDefense = Matt.inventory[Matt.wornArmor].defense;
    if(playerDefense<= enemy.attack){
    Matt.health -= (enemy.attack-playerDefense);
    }
}


class place{
    constructor(enemies,loot,desc,name){
        this.enemies = enemies;
        this.loot = loot;
        this.desc = desc;
        this.name = name;
    }
}

class matt{
    constructor(){
    this.inventory = [new item_rusty_sword(1)];
    this.health = 30;
    this.maxhealth = 30;
    this.wornArmor = 0;//default armor value
    }
}
//item classes
class item_rusty_sword{
    constructor(ammount){
        this.ammount=ammount;
        this.attack = 3;
        this.value = 1;
        this.desc = "an old rusty sword 3 ATK"
    }
}

class item_strange_goo{
    constructor(ammount){
        this.ammount=ammount;
        this.value = 0.1;
        this.desc = "a blob of something left over by a slime. gross"
    }
}

class item_blackberry{
    constructor(ammount){
        this.ammount = ammount;
        this.value = 0.5;
        this.food = 1;
        this.desc = "a small blackberry. looks edible 1 FOOD"
    }
}

class item_bread_loaf{
    constructor(ammount){
        this.ammount = ammount;
        this.value = 0.7;
        this.food = 4;
        this.desc = "a loaf of sourdough bread. looks edible 4 FOOD"
    }
}

class item_wool_coat{
    constructor(ammount){
        this.ammount = ammount;
        this.value = 5;
        this.defense = 1;
        this.disc= "a reasonable woolen overcoat. offers light protection 1 DEF"
    }
}

class item_bronze_sword {
    constructor(ammount){
        this.ammount = ammount;
        this.attack = 5;
        this.value = 5;
        this.desc = "a newly-forged bronze sword, much stronger than the last 5 ATK";
    }
}

class item_silver_sword {
    constructor(ammount){
        this.ammount = ammount;
        this.attack = 9;
        this.value = 9;
        this.desc = "a silver sword, humming with faint magical energy 9 ATK"
    }

}
//enemy classes
class enemy_slime{
    constructor(){
        this.health = 5 + Number(2*Math.random());
        this.attack = 2;
        this.defense = 1;
        this.drops = [new item_strange_goo(5 + Number(2*Math.random()))];
        this.desc = "a small green blob of agression"
    }
    update(){
        if(this.health <= 0){
            console.log("the slime screeches as it is rent assunder")
        }
    }

}

class enemy_slime_large{
    constructor(){
        this.health = 20 + Number(3*Math.random());
        this.attack = 3;
        this.defense =2;
        this.drops = [new item_strange_goo(20 + Number(3*Math.random))];
        this.desc = "a verdant, undulating blob of rage"
    }
    update(){
        if(this.health <= 0){
            Matt.place.enemies.push(new enemy_slime);
            Matt.place.enemies.push(new enemy_slime);
            console.log("the blob splits in twain to bring you pain!")
        }
    }
}

class enemy_ghoul{
    constructor(){
        this.health =  10 + Number(1*Math.random());
        this.attack = 4;
        this.defense =1;
        this.drops = [];
        this.desc = "a gaunt, rotting corpe, shambling in a cruel mockery of life"
    }
    update(){
        if(this.health <= 0){
            console.log("the gaunt figure falls for a second and final time")
        }
    }
}
let Matt = new matt();
main();
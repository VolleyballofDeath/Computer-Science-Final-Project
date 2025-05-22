


function main(){
    //initialize all locations here first
    let LocationForest00 = new location([],[],"You are Matt. You have just awoken in an enchanted forest filled barren with mystical creatures and fantasies. You remember nothing of how you arrived here, nor your life before the forest. All you have is a rusty sword, and all you know is that you feel a creeping danger here, and you must escape as quickly as possible. Understood?","Starting Location");
    let LocationForest01 = new location([new enemy_slime,new enemy_slime],[new item_blackberry(4)],"you come across a secluded grove","the forest grove");
    // intialize all the links between locations
    LocationForest00.links = [LocationForest01];
    LocationForest01.links = [LocationForest00];
    // starting initalizations
    let Matt = new matt();
    Matt.location = LocationForest00;
    Matt.heldWeapon = 0;

}

function fight(enemy,) {

    let playerAttack = Matt.inventory[Matt.heldWeapon].attack;
    if(enemy.defense<= playerAttack){
    enemy.health -= (playerAttack-enemy.defense);
    }
    if (enemy.health <= 0) {
        console.log("Congratulations! You have defeated the enemy] slime!");
    
    }
       if (Matt.location == LocationForest00) {
            console.log("You found a bronze sword hidden beneath a patch of moss.");
            Matt.inventory[0] = new item_bronze_sword(1);
        } else if (Matt.location == LocationForest01) {
            console.log("You uncover a gleaming silver sword lodged in an old tree trunk.");
            Matt.inventory[0] = new item_silver_sword(1);
        } else {
            console.log("You scavenge parts from the creature, but find nothing of value.");
        }
    
}


function move() {
   let currentLocation = matt.location
   console.log("your options are")
   for(let i = 0; i < currentLocation.links.length; i++) {
       console.log(currentLocation.links[i].name + ", ")
   }
   while (true){
   let input = prompt("Where do you want to go? CASE SENSETIVE")
    for(let i = 0; i < currentLocation.links.length; i++) {
       if(input == currentLocation.links[i].name)
           matt.location = currentLocation.link[i]
            break;
   }
    }
}

class location{
    constructor(enemies,loot,desc,name){
        this.enemies = enemies;
        this.loot = loot;
        this.desc = desc;
        this.name = name;
    }
}

class matt{
    constructor(){
    this.inventory = [new rusty_sword(1)];
    this.health = 30;
    }
}
//item classes
class item_rusty_sword{
    constructor(ammount){
        this.ammount=ammount;
        this.attack = 3;
        this.value = 1;
        this.desc = "an old rusty sword"
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
        this.desc = "a small blackberry. looks edible"
    }
}

class item_bread_loaf{
    constructor(ammount){
        this.ammount = ammount;
        this.value = 0.7;
        this.food = 4;
        this.desc = "a loaf of sourdough bread. looks edible"
    }
}

class item_wool_coat{
    constructor(ammount){
        this.ammount = ammount;
        this.value = 5;
        this.defense = 1;
        this.disc= "a reasonable woolen overcoat. offers light protection"
    }
}

class item_bronze_sword {
    constructor(amount){
        this.amount = amount;
        this.attack = 5;
        this.desc = "a newly-forged bronze sword, much stronger than the last";
    }
}

class item_silver_sword {
    constructor(ammount){
        this.ammount = ammount;
        this.attack = 9;
        this.value = 4;
        this.desc = "a silver sword, humming with faint magical energy"
    }

        
//enemy classes
class enemy_slime{
    constructor(){
        this.health = 5 + Number(2*Math.random());
        this.attack = 2;
        this.defense = 1;
        this.drops = [item_strange_goo(5 + Number(2*Math.random()))];
        this.desc = "a small green blob of agression"
    }
    update(){
        if(health <= 0){

        }
    }

}

class enemy_slime_large{
    // not finished, dont use
    constructor(){
        this.health = 20 + Number(3*Math.random());
        this.attack = 3;
        this.defense =2;
        this.drops = [item_strange_goo(20 + Number(3*Math.random))];
        this.desc = "a verdant, undulating blob of rage"
    }
    update(){
        if(health <= 0){
            Matt.location.enemies.push(new enemy_slime);
            Matt.location.enemies.push(new enemy_slime);
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
        if(health <= 0){

        }
    }
}

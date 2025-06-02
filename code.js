

    let Matt = new matt();
function main(){
    //initialize all locations here first
    let PlaceForest00 = new place([],[],"You are Matt. You have just awoken in an enchanted forest filled barren with mystical creatures and fantasies. You remember nothing of how you arrived here, nor your life before the forest. All you have is a rusty sword, and all you know is that you feel a creeping danger here, and you must escape as quickly as possible. Understood?","Starting Location");
    let PlaceForest01 = new place([new enemy_slime,new enemy_slime],[new item_blackberry(4)],"you come across a secluded grove","the forest grove");
    // intialize all the links between locations
    PlaceForest00.links = [PlaceForest01];
    PlaceForest01.links = [PlaceForest00];
    // starting initalizations

    Matt.place = PlaceForest00;
    Matt.heldWeapon = 0;

    console.log("hello world")
    move();
}





function consume(item){
    if(item.ammount >= 1 ){
    if(Matt.health < Matt.maxhealth){
        Matt.health += item.food
        if(Matt.health >= Matt.maxhealth){
            Matt.health = Matt.maxhealth
        }
        item.ammount -= 1;
    }else{
        console.log("you are too full to eat")
    } 
    }else{
        console.log("you dont have that")
    }
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
function move() {
   let currentPlace = Matt.place;
   console.log("your options are")
   for(let i = 0; i < currentPlace.links.length; i++) {
       console.log(currentPlace.links[i].name + ", ")
   }
   while (true){
   let input = prompt("Where do you want to go? CASE SENSITIVE")
    for(let i = 0; i < currentPlace.links.length; i++) {
       if(input == currentPlace.links[i].name)
           Matt.place = currentPlace.links[i]
            break;
   }
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
        this.value = 5;
        this.desc = "a newly-forged bronze sword, much stronger than the last";
    }
}

class item_silver_sword {
    constructor(ammount){
        this.ammount = ammount;
        this.attack = 9;
        this.value = 9;
        this.desc = "a silver sword, humming with faint magical energy"
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
        if(health <= 0){
            console.log("the blob lets out a final gurgling squelch")
            this.attack = 0;
        }
    }

}

class enemy_slime_large{
    constructor(){
        this.health = 20 + Number(3*Math.random());
        this.attack = 3;
        this.defense =2;
        this.drops = [item_strange_goo(20 + Number(3*Math.random))];
        this.desc = "a verdant, undulating blob of rage"
    }
    update(){
        if(health <= 0){
            Matt.place.enemies.push(new enemy_slime);
            Matt.place.enemies.push(new enemy_slime);
            console.log("the blob splits in twain to bring you pain!")
            this.attack = 0;
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
            console.log("the gaunt figure falls for a second and final time")
            this.attack = 0;
        }
    }
}

main();



function main(){
    //initialize all locations here first
    let LocationForest00 = new location([],[],"you awake here with no memory, holding an old rusty sword");
    let LocationForest01 = new location([new enemy_slime,new enemy_slime],[new item_blackberry(4)],"you come across a secluded grove");

    let Matt = new matt;
}


class location{
    constructor(enemies,loot,desc){
        this.enemies = enemies;
        this.loot = loot;
        this.desc = desc;
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
//enemy classes
class enemy_slime{
    constructor(){
        this.health = 5 + Number(2*Math.random());
        this.attack = 2;
        this.defense = 1;
        this.drops = [item_strange_goo(5 + Number(2*Math.random()))]
    }
}
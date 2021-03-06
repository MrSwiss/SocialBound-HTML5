var _ = require("underscore");
var cls = require("./class");
var Types = require("../gametypes");
var Message = require("./message");
var Map = require("./map");
var Box = require('./box');
var Vector = require('./vect');

// Shoot
module.exports = class Shoot {
    constructor(data) {
        let x = data.x0,
            y = data.y0,
            ang = data.ang, 
            power = data.power,
            type = data.type,
            ax = data.ax,
            ay = data.ay,
            wind_ang = data.wind_ang,
            wind_power = data.wind_power,
            account = data.account;

        var self = this;
        this.x0 = x;
        this.y0 = y;
        this.ax = ax;
        this.ay = ay;
        this.account = account;
        this.ang = ang;
        this.power = power;
        this.time = 0;
        this.stime = 0;
        this.exp = 0;
        this.img = 0;
        this.wind_ang = wind_ang;
        this.wind_power = wind_power;
        this.chat_complete = false;
        this.v = new Vector2(this.ang, this.power);
        this.orbit = null;
        this.explodeGhost = false;
        this.is_lightning = null;
        this.before = {
            lightning: false,
            lightning2: false,
            thor: false,
        };
        this.hole = {
            w: 10,
            h: 10
        }
        this.IsComplete = false;
        this.canCollide = false;
        this.damageComplete = false;
        this.groundCollide = false;

        this.box = new Box(new Vector(x, y), 30, 25, 0);
        this.explodebox = new Box(new Vector(x, y), 40, 40, 0);
        this.ss = 0;


        var mobile = this.account.player.mobile;
        var defmobile = Types.MOBILES[mobile];
        this.damageshot = 150;
        if (type === 0) {
            this.ss = 0;
            this.damageshot = 150;
			if (mobile == Types.MOBILE.ADUKA)
                this.damageshot = 100;
            else if (mobile == Types.MOBILE.BIGFOOT)
                this.damageshot = 100;
            else if (mobile == Types.MOBILE.DRAGON)
                this.damageshot = 100;
            else if (mobile == Types.MOBILE.TRICO)
                this.damageshot = 100;
            else if (mobile == Types.MOBILE.TURTLE)
                this.damageshot = 100;
            else if (mobile == Types.MOBILE.BOOMER)
                this.damageshot = 100;
            else if (mobile == Types.MOBILE.ELECTRICO)
                this.damageshot = 100;
            else if (mobile == Types.MOBILE.GRUB)
                this.damageshot = 100;
            else if (mobile == Types.MOBILE.RAON)
                this.damageshot = 100;
            else if (mobile == Types.MOBILE.KALSIDDON)
                this.damageshot = 100;
        } else if (type == 1) {
            if (mobile == Types.MOBILE.ADUKA)
                this.damageshot = 150;
            else if (mobile == Types.MOBILE.BIGFOOT)
                this.damageshot = 150;
            else if (mobile == Types.MOBILE.DRAGON)
                this.damageshot = 150;
            else if (mobile == Types.MOBILE.TRICO)
                this.damageshot = 150;
            else if (mobile == Types.MOBILE.TURTLE)
                this.damageshot = 150;
            else if (mobile == Types.MOBILE.BOOMER)
                this.damageshot = 150;
            else if (mobile == Types.MOBILE.ELECTRICO)
                this.damageshot = 150;
            else if (mobile == Types.MOBILE.GRUB)
                this.damageshot = 150;
            else if (mobile == Types.MOBILE.RAON)
                this.damageshot = 150;
            else if (mobile == Types.MOBILE.KALSIDDON)
                this.damageshot = 150;
            this.ss = 0;
        } else if (type == 2) {
            this.ss = 4;
            this.damageshot = 350;
			if (mobile == Types.MOBILE.ADUKA)
                this.damageshot = 350;
            else if (mobile == Types.MOBILE.BIGFOOT)
                this.damageshot = 350;
            else if (mobile == Types.MOBILE.DRAGON)
                this.damageshot = 350;
            else if (mobile == Types.MOBILE.TRICO)
                this.damageshot = 350;
            else if (mobile == Types.MOBILE.TURTLE)
                this.damageshot = 350;
            else if (mobile == Types.MOBILE.BOOMER)
                this.damageshot = 350;
            else if (mobile == Types.MOBILE.ELECTRICO)
                this.damageshot = 350;
            else if (mobile == Types.MOBILE.GRUB)
                this.damageshot = 350;
            else if (mobile == Types.MOBILE.RAON)
                this.damageshot = 350;
            else if (mobile == Types.MOBILE.KALSIDDON)
                this.damageshot = 350;
        }

        this.img = defmobile.bullets[type];
        var fexp = defmobile.explodes[type];
        if (typeof (fexp) == 'undefined' || fexp === null) {
            this.exp = 0;
        } else this.exp = fexp;
    }

    move(x, y) {
        if (this.box === null)
            this.box = new Box(new Vector(x, y), 30, 25, 0);
        this.box.setp(new Vector(x, y));
    }

    setExplodebox(x, y) {
        if (this.explodebox === null)
            this.explodebox = new Box(new Vector(x, y), 40, 40, 0);
        this.explodebox.setp(new Vector(x, y));
    }

    update() {
        this.time++;
    }

    getPosAtTime() {
        var a = this.time / 485;
        let getPosAtTime = {
            x: Math.ceil(this.x0 + this.v.x * a + this.ax * a * a / 2),
            y: Math.ceil(this.y0 + this.v.y * a + this.ay * a * a / 2)
        };
        let b = this.orbit ? this.GetPosAtTimeOrbit(this.time, this.orbit[0], this.orbit[1], this.orbit[2], this.orbit[3]) : getPosAtTime;
        return b;
    }
    GetPosAtTimeOrbit(a, b, c, d, e){
        var a = a / 485,
            f = this.y0 + this.v.y * a + this.ay * a * a / 2;
        return {
            x: Math.round(this.x0 + this.v.x * a + this.ax * a * a / 2 + (a >= d ? e : e * a / d) * Math.cos(AngleToRad(b + c * a))),
            y: Math.round(f - (a >= d ? e : e * a / d) * Math.sin(AngleToRad(b + c * a)))
        }
    }
    GetAngleAtTime(a) {
        var b = this.getPosAtTime(a - 5);
        a = this.getPosAtTime(a + 5);
        return RadToAngle(Math.atan2(a.y - b.y, a.x - b.x));
    }

};

function Vector2(a, b) {
    this.ang = a;
    this.size = b;
    this.x = Math.cos(a * Math.PI / 180) * b;
    this.y = -Math.sin(a * Math.PI / 180) * b;
}

function RadToAngle(a) {
    return 180 * a / Math.PI;
}

function AngleToRad(a) {
    return a * Math.PI / 180;
}
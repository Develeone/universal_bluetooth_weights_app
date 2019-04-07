let bodymetrics = {
    sex: 0,
    age: 0,
    height: 0,

    constructor: function (sex, age, height) {
        this.sex = sex; // 1 = male
        this.age = age;
        this.height = height;

        return this;
    },

    getLBMCoefficient: function (weight, impedance) {
        let lbm = (this.height * 9.058 / 100.0) * (this.height / 100.0);
        lbm += weight * 0.32 + 12.226;
        lbm -= impedance * 0.0068;
        lbm -= this.age * 0.0542;

        return lbm;
    },

    getBMI: function(weight) {
        return weight / (((this.height * this.height) / 100.0) / 100.0);
    },
    
    getMuscle: function(weight, impedance) {
        let muscleMass = weight - ((this.getBodyFat(weight, impedance) * 0.01) * weight) - this.getBoneMass(weight, impedance);

        if (this.sex == 0 && muscleMass >= 84.0) {
            muscleMass = 120.0;
        }
        else if (this.sex == 1 && muscleMass >= 93.5) {
            muscleMass = 120.0;
        }

        return muscleMass;
    },

    getMusclePercents: function(weight, impedance) {
        return this.getMuscle(weight, impedance) / weight * 100;
    },


    getWater: function(weight,impedance)
    {
        let coeff;
        let water = (100.0 - this.getBodyFat(weight, impedance)) * 0.7;

        if (water < 50) {
            coeff = 1.02;
        } else {
            coeff = 0.98;
        }

        return coeff * water;
    },


    getBoneMass: function(weight, impedance)
    {
        let boneMass;
        let base;

        if (this.sex == 0) {
            base = 0.245691014;
        }
        else {
            base = 0.18016894;
        }

        boneMass = (base - (this.getLBMCoefficient(weight, impedance) * 0.05158)) * -1.0;

        if (boneMass > 2.2) {
            boneMass += 0.1;
        }
        else {
            boneMass -= 0.1;
        }

        if (this.sex == 0 && boneMass > 5.1) {
            boneMass = 8.0;
        }
        else if (this.sex == 1 && boneMass > 5.2) {
            boneMass = 8.0;
        }

        return boneMass;
    },

    getBonePercentage:  function(weight, impedance) {
        return this.getBoneMass(weight, impedance) / weight * 100;
    },

    getVisceralFat: function(weight) {
        let visceralFat = 0.0;
        
        if (this.sex == 0) {
            if (weight > (13.0 - (this.height * 0.5)) * -1.0) {
                let subsubcalc = ((this.height * 1.45) + (this.height * 0.1158) * this.height) - 120.0;
                let subcalc = weight * 500.0 / subsubcalc;
                visceralFat = (subcalc - 6.0) + (this.age * 0.07);
            }
            else {
                let subcalc = 0.691 + (this.height * -0.0024) + (this.height * -0.0024);
                visceralFat = (((this.height * 0.027) - (subcalc * weight)) * -1.0) + (this.age * 0.07) - this.age;
            }
        }
        else {
            if (this.height < weight * 1.6) {
                let subcalc = ((this.height * 0.4) - (this.height * (this.height * 0.0826))) * -1.0;
                visceralFat = ((weight * 305.0) / (subcalc + 48.0)) - 2.9 + (this.age * 0.15);
            }
            else {
                let subcalc = 0.765 + this.height * -0.0015;
                visceralFat = (((this.height * 0.143) - (weight * subcalc)) * -1.0) + (this.age * 0.15) - 5.0;
            }
        }

        return ((visceralFat > 1) ? visceralFat : 1);
    },

    getBodyFat: function(weight, impedance) {
        let bodyFat = 0.0;
        let lbmSub = 0.8;

        if (this.sex == 0 && this.age <= 49) {
            lbmSub = 9.25;
        } else if (this.sex == 0 && this.age > 49) {
            lbmSub = 7.25;
        }

        let lbmCoeff = this.getLBMCoefficient(weight, impedance);
        let coeff = 1.0;

        if (this.sex == 1 && weight < 61.0) {
            coeff = 0.98;
        }
        else if (this.sex == 0 && weight > 60.0) {
            coeff = 0.96;

            if (this.height > 160.0) {
                coeff *= 1.03;
            }
        }
        else if (this.sex == 0 && weight < 50.0) {
            coeff = 1.02;

            if (this.height > 160.0) {
                coeff *= 1.03;
            }
        }

        bodyFat = (1.0 - (((lbmCoeff - lbmSub) * coeff) / weight)) * 100.0;

        if (bodyFat > 63.0)
            bodyFat = 75.0;

        return bodyFat;
    },

    getFatFreeMass: function(weight, impedance) {
        return weight - weight / 100 * this.getBodyFat(weight, impedance);
    }
};
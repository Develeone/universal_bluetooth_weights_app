class MiScaleLib {
    function getLBMCoefficient(weight, impedance) {
        var lbm = (height * 9.058 / 100.0) * (height / 100.0);
        lbm += weight * 0.32 + 12.226;
        lbm -= impedance * 0.0068;
        lbm -= age * 0.0542;

        return lbm;
    }

    function getBMI(weight) {
        return weight / (((height * height) / 100.0) / 100.0);
    }


    function getMuscle(weight, impedance) {
        var muscleMass = weight - ((getBodyFat(weight, impedance) * 0.01) * weight) - getBoneMass(weight, impedance);

        if (sex == 0 && muscleMass >= 84.0) {
            muscleMass = 120.0;
        }
        else if (sex == 1 && muscleMass >= 93.5) {
            muscleMass = 120.0;
        }

        return muscleMass;
    }


var
    getWater
(
var
    weight, var
impedance
)
{
    var
        coeff;
    var
        water = (100.0
    f - getBodyFat(weight, impedance)
) *
    0.7;

    if (water < 50) {
        coeff = 1.02;
    } else {
        coeff = 0.98;
    }

    return coeff * water;
}


var
    getBoneMass
(
var
    weight, var
impedance
)
{
    var
        boneMass;
    var
        base;

    if (sex == 0) {
        base = 0.245691014;
    }
    else {
        base = 0.18016894;
    }

    boneMass = (base - (getLBMCoefficient(weight, impedance) * 0.05158)) * -1.0;

    if (boneMass > 2.2) {
        boneMass += 0.1;
    }
    else {
        boneMass -= 0.1;
    }

    if (sex == 0 && boneMass > 5.1) {
        boneMass = 8.0;
    }
    else if (sex == 1 && boneMass > 5.2) {
        boneMass = 8.0;
    }

    return boneMass;
}

    function getVisceralFat(weight) {
        var visceralFat = 0.0;
        if (sex == 0) {
            if (weight > (13.0 - (height * 0.5)) * -1.0) {
                var subsubcalc = ((height * 1.45) + (height * 0.1158) * height) - 120.0;
                var subcalc = weight * 500.0 / subsubcalc;
                visceralFat = (subcalc - 6.0) + (age * 0.07);
            }
            else {
                var subcalc = 0.691 + (height * -0.0024) + (height * -0.0024);
                visceralFat = (((height * 0.027) - (subcalc * weight)) * -1.0) + (age * 0.07) - age;
            }
        }
        else {
            if (height < weight * 1.6) {
                var subcalc = ((height * 0.4) - (height * (height * 0.0826))) * -1.0;
                visceralFat = ((weight * 305.0) / (subcalc + 48.0)) - 2.9 + (age * 0.15);
            }
            else {
                var subcalc = 0.765 + height * -0.0015;
                visceralFat = (((height * 0.143) - (weight * subcalc)) * -1.0) + (age * 0.15) - 5.0;
            }
        }

        return visceralFat;
    }

    function getBodyFat(weight, impedance) {
        var bodyFat = 0.0;
        var lbmSub = 0.8;

        if (sex == 0 && age <= 49) {
            lbmSub = 9.25;
        } else if (sex == 0 && age > 49) {
            lbmSub = 7.25;
        }

        var lbmCoeff = getLBMCoefficient(weight, impedance);
        var coeff = 1.0;

        if (sex == 1 && weight < 61.0) {
            coeff = 0.98;
        }
        else if (sex == 0 && weight > 60.0) {
            coeff = 0.96;

            if (height > 160.0) {
                coeff *= 1.03;
            }
        }
        else if (sex == 0 && weight < 50.0) {
            coeff = 1.02;

            if (height > 160.0) {
                coeff *= 1.03;
            }
        }

        bodyFat = (1.0 - (((lbmCoeff - lbmSub) * coeff) / weight)) * 100.0;

        if (bodyFat > 63.0)
            bodyFat = 75.0;

        return bodyFat;
    }

}

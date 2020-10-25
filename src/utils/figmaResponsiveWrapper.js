import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export class figmaWp{
    constructor(screenWidth){
        this.screenWidth = screenWidth;
    }

    responsive(val){
        return wp(get_parcent(val, this.screenWidth))
    }
}

export class figmaHp{
    constructor(screenHeight){
        this.screenHeight = screenHeight;
    }

    responsive(val){
        return hp(get_parcent(val, this.screenHeight))
    }
}

function get_parcent(val, screenVal){
    if(typeof(val) === "string"){
        return val
    }
    const parcent = val / screenVal;
    return String(parcent) + "%"
}

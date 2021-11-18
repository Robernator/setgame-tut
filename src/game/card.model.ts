export class CardModel {
    cardId: string;
    color: CardColor;
    number: Number; //{1, 2, 3}
    shape: CardShape; //{heart, square, diamond}
    filling: CardFilling; //{clear, solid, shade}
    filename: string;
    selected = false;
    selectedCheating = false;
    isSet = false;

    constructor(color_:CardColor, number_: Number, shape_:CardShape, filling_:CardFilling, cardId: number = 1) {
        this.cardId = 'card' + cardId;
        this.color = color_;
        this.number = number_;
        this.shape = shape_;
        this.filling = filling_;
        this.filename = "./assets/cards/"+this.number+'_'+CardShape[this.shape]+'_'+CardColor[this.color]+'_'+
                        CardFilling[this.filling]+'.png';                               
    }
};


enum CardColor {
    red = 1,
    blue,
    green
}

enum CardShape {
    heart = 1,
    square,
    diamond
}

enum CardFilling {
    clear = 1,
    solid,
    shade
}

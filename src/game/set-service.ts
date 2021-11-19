import { CardModel } from './card.model.js';

export class SetService {
    private onStack = new Array<CardModel>();

    constructor() {
        console.log('show board game');
    }

    private showCardsOnTable() {
        let boardHtml = '';
        for (const card of this.onStack) {
            boardHtml += `<div><img id="${card.cardId}" src="${card.filename}" class="card"/></div>`;
        }
        document.getElementById('board-grid')!.innerHTML = boardHtml;
    } 

    public createBoard(): void {
        this.createStack();
        this,this.showCardsOnTable();
    }

    private createStack() {
        this.onStack.length = 0;
        const orderedStack = new Array();
        let cardNr = 0;
        for (var nr = 1; nr <= 3; nr++) {
            for (var color = 1; color <= 3; color++) {
                for (var shape = 1; shape <= 3; shape++) {
                    for (var filling = 1; filling <= 3; filling++) {
                        orderedStack.push(new CardModel(color, nr, shape, filling, cardNr));
                        cardNr++;
                    }
                }
            }
        }
        // shake the stack of cards
        for (var nr = 81; nr >= 1; nr--) {
            const cardNr = nr-1;
            this.onStack.push(orderedStack[cardNr]);
            orderedStack.splice(cardNr, 1);
        }
    }

   

}
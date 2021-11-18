import { CardModel } from './card.model.js';

export class SetService {
    private onStack = new Array<CardModel>();
    private onTable = new Array<CardModel>();
    private setSetSelected = new Array<CardModel>();

    constructor() {
        console.log('show board game');
    }

    private showCardsOnTable() {
        this.showSetOnTable(false);
        let boardHtml = '';
        for (const card of this.onTable) {
            boardHtml += `<div><img id="${card.cardId}" src="${card.filename}" class="card"/></div>`;
        }
        document.getElementById('board-grid')!.innerHTML = boardHtml;
        this.createCardEventListeners();
    }

    private createCardEventListeners(): void {
        for (const card of this.onTable) {
            let btn = document.getElementById(card.cardId);
            btn!.addEventListener("click", (e: Event) => this.selectCard(card.cardId));
        }
    }

    private selectCard(cardId: string) {
        const card = this.onTable.find(c => c.cardId === cardId);
        if (card) {
            card.selected = !card.selected
            const className = card.selected ? 'card-selected' : 'card';
            let btn = document.getElementById(cardId);
            btn!.className = className;
        }
        this.setSetSelected = this.onTable.filter(card => card.selected === true).sort((f, s) => f.number > s.number ? 1 : -1);
        if (this.setSetSelected.length === 3) {
            const isSet = this.checkSet(this.setSetSelected[0], this.setSetSelected[1], this.setSetSelected[2]);
            this.showSelectedOnTable(isSet);
        }
    }

    private checkSet(card1: CardModel, card2: CardModel, card3: CardModel): boolean {
        const cardThird = this.createThirdCard(card1, card2);
        const findSet = card3.filename === cardThird.filename;
        if (findSet) {
            card1.isSet = true;
            card2.isSet = true;
            card3.isSet = true;
        }
        return findSet;
    }

    private showSelectedOnTable(isSet: boolean) {
        let boardHtml = '';
        for (const card of this.setSetSelected) {
            boardHtml += `<div><img id="${card.cardId}" src="${card.filename}" class="card"/></div>`;
        }
        document.getElementById('showSet')!.innerHTML = boardHtml;
        this.showSetOnTable(true, isSet);
    }

    private showSetOnTable(showVisible: boolean, isSet = false) {
        const isSetClass = isSet ? 'show-set-ok' : 'show-set-wrong';
        document.getElementById('show-set-container')!.className = (showVisible === true ? 'show-set show-visible ' + isSetClass : 'show-set not-visible');
    }

    public createBoard(): void {
        this.createStack();
        this.cardsOnTable();
        this.showCardsOnTable();
    }

    public createMenuListener(): void {
        let btn = document.getElementById('startGame');
        btn!.addEventListener("click", (e: Event) => this.createBoard());

        let cheat = document.getElementById('cheat');
        cheat!.addEventListener("click", (e: Event) => this.findSetByCheat());

        let nextCardsAfterSet = document.getElementById('nextCardsAfterSet');
        nextCardsAfterSet!.addEventListener("click", (e: Event) => this.newCardsAfterSetFound());
    }

    private findSetByCheat() {
        this.showSetOnTable(false);
        if (this.isThereSet()) {
            this.onTable.filter(c => c.isSet).forEach(card => {
                let btn = document.getElementById(card.cardId);
                btn!.className = 'card-cheat';
            });
        }
        setTimeout(() => this.clearSelectionShow(), 3000);
    }

    private clearSelectionShow() {
        this.onTable.filter(c => c.isSet || c.selected).forEach(card => {
            let btn = document.getElementById(card.cardId);
            card.isSet = false;
            card.selected = false;
            btn!.className = 'card';
        });
    }

    private newCardsAfterSetFound() {
        this.showSetOnTable(false);
        this.onTable.filter(c => c.isSet).forEach(card => {
            const cardNr = this.onTable.indexOf(card);
            const cardInSet = this.onTable[cardNr];
            if (this.onStack.length > 0 && this.onTable.length <= 12) {
                this.onTable[cardNr] = this.onStack.pop()!;
            } else {
                this.onTable.splice(cardNr, 1);
            }
        });
        this.showCardsOnTable();
        this.clearSelectionShow();
        this.showNrCardsOnStack();
    }

    private cardsOnTable() {
        for (var nr = 1; nr <= 12; nr++) {
            const card = this.onStack.pop();
            if (card) {
                this.onTable.push(card);
            }
        }
    }

    private createStack() {
        this.onStack.length = 0;
        this.onTable.length = 0;
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
            const cardNr = this.randomNr(nr);
            this.onStack.push(orderedStack[cardNr]);
            orderedStack.splice(cardNr, 1);
        }
    }

    private randomNr(cards: number): number {
        return Math.floor(Math.random() * cards);
    }

    private getProperty(nr1: Number, nr2: Number) {
        if ((nr1 === 1 && nr2 === 2) || (nr1 === 2 && nr2 === 1)) {
            return 3;
        }
        if ((nr1 === 3 && nr2 === 2) || (nr1 === 2 && nr2 === 3)) {
            return 1;
        }
        return 2;
    }

    private createThirdCard(card1: CardModel, card2: CardModel) {
        const nr = card1.number === card2.number ? card2.number : this.getProperty(card1.number, card2.number);
        const color = card1.color === card2.color ? card2.color : this.getProperty(card1.color, card2.color);
        const shape = card1.shape === card2.shape ? card2.shape : this.getProperty(card1.shape, card2.shape);
        const filling = card1.filling === card2.filling ? card2.filling : this.getProperty(card1.filling, card2.filling);
        return new CardModel(color, nr, shape, filling);
    }

    private clearSelection() {
        this.onTable.forEach(card => {
            card.selected = false;
            card.isSet = false
        });
    }

    private showNrCardsOnStack() {
        document.getElementById('cardsOnStack')!.innerHTML = `Cards: ${this.onStack.length}`;
    }

    private isThereSet(): boolean {
        this.clearSelection();
        const nrOfCards = this.onTable.length;
        for (var cardNr = 0; cardNr < nrOfCards; cardNr++) {
            const card1 = this.onTable[cardNr];
            for (var cardNextNr = cardNr + 1; cardNextNr < nrOfCards; cardNextNr++) {
                const card2 = this.onTable[cardNextNr];
                const card3 = this.createThirdCard(card1, card2);
                const cardFound = this.onTable.find(c => c.filename === card3.filename);
                if (cardFound) {
                    card1.isSet = true;
                    card2.isSet = true;
                    cardFound.isSet = true;
                    return true;
                }
            }
        }
        return false;
    }

}
import { CardModel } from './card.model.js';

export class SetService {
    private onStack = new Array<CardModel>();
    private onTable = new Array<CardModel>();
    private setSetSelected = new Array<CardModel>();

    constructor() {
        console.log('show board game');
    }

    private showCardsOnTable() {
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
        this.setSetSelected = this.onTable.filter(card => card.selected === true).sort( (f,s) => f.number > s.number? 1: -1);
        if (this.setSetSelected.length === 3) {
            this.showSelectedOnTable();
        }
    }

    private showSelectedOnTable() {
        let boardHtml = '';
        for (const card of this.setSetSelected) {
            boardHtml += `<div><img id="${card.cardId}" src="${card.filename}" class="card"/></div>`;
        }
        document.getElementById('showSet')!.innerHTML = boardHtml;
        this.showSetOnTable(true);
    }

    private showSetOnTable(showVisible: boolean) {
        document.getElementById('show-set-container')!.className = (showVisible === true ? 'show-set show-visible' : 'show-set not-visible');
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
        alert('findSetByCheat');
    }

    private newCardsAfterSetFound() {
        alert('newCardsAfterSetFound');
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


}
class Game {
    constructor() {
        this.mole = document.querySelectorAll('.mole');
        this.divLevel = document.querySelector('.divLevel');
        this.time = 0;
        this.level =0;
        this.computerScore = 0;
        this.userScore = 0;
        this.buttonToStart = document.querySelector('#startBtn');
        this.timeInLevel = document.querySelector('#levelChoose');
        this.buttonToStart.addEventListener('click', this.levelChoose.bind(this));
        this.userClick = this.userWin.bind(this)
}
    randomMole(){
        let arrayMoles = document.querySelectorAll('.mole:not(.win):not(.fail)');
        const indexOfActiveMole = Math.floor(Math.random() * arrayMoles.length);
        return arrayMoles[indexOfActiveMole];
    }

    static get Level () {
        return {
            easy:1500,
            medium:1000,
            hard:50,
        }
    }


    levelChoose(){
       let checked = this.timeInLevel.querySelector('input:checked');
       this.level = checked.getAttribute('value');
       console.log(this.level);
       this.startGame()

    }

    startGame() {
        if(!this.winner){
            let currentMole = this.randomMole();
            currentMole.classList.add('active');
            this.time = setTimeout(this.computerWin.bind(this,currentMole,Game.Level[this.level]), Game.Level[this.level]);
            currentMole.addEventListener('click', this.userClick);
            this.divLevel.classList.add('displayForDiv')
        }else{
            this.finishGame()
        }
    }

    userWin(click){
        let target = click.target;
        target.classList.remove('active');
        target.classList.add('win');
        target.removeEventListener('click', this.userClick);
        clearTimeout(this.time);
        this.userScore++;
        this.startGame(this.time);
    }

    computerWin(currentMole, time){
        this.computerScore++;
        currentMole.classList.remove('active');
        currentMole.classList.add('fail');
        currentMole.removeEventListener('click', this.userClick);
        this.startGame(time)
    }

    get winner(){
        return (this.computerScore === 50 || this.userScore ===50)
        //
    }

    finishGame(){
        if (this.computerScore === 50 || this.userScore ===50){
                if (this.computerScore === 50){
                    alert('Computer win');
                }else{
                    alert('User win');
                }
            }else if(this.computerScore ===50 && this.userScore ===50){
                alert('1:1');
            }
        [...this.mole].forEach(index => index.classList.remove('win', 'fail'));
        this.divLevel.classList.remove('displayForDiv');
        this.computerScore =0;
        this.userScore = 0;
    }
}

new Game();







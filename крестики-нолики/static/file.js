function initBoard(){
    let board=document.getElementById('board');
    for (let i=0; i<9;i++){
        let boardCell=document.createElement('div');
        boardCell.classList.add('cell');
        board.append(boardCell);
    }
    return board;
}

function chekWinner(){
    let cells = document.querySelectorAll('.cell');
    let row, column, diag1, diag2;
    for (let i=0; i<3;i++){
        row=(cells[i*3].innerHTML !='');
        column=(cells[i].innerHTML !='');
        diag1=(cells[0].innerHTML !='');
        diag2=(cells[3-1].innerHTML !='');
        for (let j=0; j<2;j++){
            row=row && (cells[i*3+j].innerHTML) == (cells[i*3+j+1].innerHTML);
            column=column && (cells[j*3+i].innerHTML)==(cells[(j+1)*3+i].innerHTML);
            diag1=diag1 && (cells[j*3+j].innerHTML)==(cells[(j+1)*3+j+1].innerHTML);
            diag2=diag2 && (cells[j*3+(3-1)-j].innerHTML)==(cells[(j+1)*3+3-1-(j+1)].innerHTML);
        }
        let winner=(row && cells[i*3].innerHTML) ||(column && cells[i].innerHTML) || (diag1 && cells[0].innerHTML) || (diag2 && cells[3-1].innerHTML);
        if (winner) return winner;
    } 
}
let count=0;
let turn =0;
let gameOver=0;
function clickHandler(event){
    if(event.target.className == 'cell'){
        if (gameOver){
            showMessage ("Игра окончена, начните новую игру.", 'error');
            return;
        }
        if (event.target.innerHTML != '')
            showMessage ('Клетка уже занята, будь внимательнее!!!', 'error');
        else{
            event.target.innerHTML = turn ==0 ? 'x':'0';
            turn=(turn+1)%2;
            count++;
        }
    }
    let winner=chekWinner();
    if (winner && count <10){ 
        gameOver = 1;
        showMessage(`${winner}, одержал победу!`);
    } else if(count==9) showMessage('Ничья!');
}
function newGame(){
    let cells=document.querySelectorAll('.cell')
    for (let i=0;i<9;i++){
    cells[i].innerHTML='';
    }
    count =0;
    turn =0;
    gameOver=0;
}

function showMessage(msg, category='success'){
    let msgContainer=document.querySelector('.message');
    let msgElement=document.createElement('div');
    msgElement.innerHTML=msg;
    msgElement.classList.add('msg');//добавление стиля
    msgElement.classList.add(category);
    msgContainer.append(msgElement);
    setTimeout(()=> msgElement.remove(),2000);

}

window.onload=function(){
    let board =initBoard();
    board.onclick=clickHandler;
    document.querySelector('.new-game-btn').onclick=newGame;
}

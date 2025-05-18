const QUESTIONS = [
    {
      img: 'https://i.pinimg.com/1200x/fd/46/8c/fd468c16dfc81ba35c28521b724c1542.jpg',
      text: 'Где работает Губка Боб?',
      answers: ['Красти Краб', 'Чумовое Ведро', 'Бикини Ботом Кафе', 'Ракушка Бар'],
      rightIndex: 0,   
    },
    {
      img: 'https://i.pinimg.com/1200x/52/6e/fb/526efb834f0cd20e5d4103f09e5d901f.jpg',
      text: 'Кто лучший друг Губка Боба?',
      answers: ['Сквидвард', 'Патрик', 'Планктон', 'Сэнди'],
      rightIndex: 1,
    },
    {
      img: 'https://i.pinimg.com/1200x/c0/ab/d6/c0abd6cf1cbbea7dadc7ccb2d2feae06.jpg',
      text: 'Как зовут любимого питомца Губки Боба?',
      answers: ['Пинки', 'Спанч', 'Гэри', 'Рокки'],
      rightIndex: 2,
    },
    {
      img: 'https://i.pinimg.com/736x/70/0f/30/700f303e98ae4d9291a63e68629331f6.jpg',
      text: 'Как называется конкурирующий ресторан против Красти Краба?',
      answers: ['Чумовое Ведро', 'Крабовый Клуб', 'Крабовый Краб', 'Ведро и Краб'],
      rightIndex: 0,
    },
    {
      img: 'https://i.pinimg.com/736x/fa/33/9f/fa339fe79e29b7085649ea984ef586e9.jpg',
      text: 'Какой инструмент играет Сквидвард?',
      answers: ['Флейта', 'Кларнет', 'Труба', 'Гитара'],
      rightIndex: 1,
    },
  ];
  
  const SCREENS_NODES = document.querySelectorAll('.screen');
  const ANSWERS_NODES = document.querySelectorAll('.answer');
  const START_GAME_BUTTONS = document.querySelectorAll('.start-game');
  const MONEY_NODES = document.querySelectorAll('.money');
  const PRIZE_FOR_RIGHT_ANSWER = 200000;
  const HIGHLIGHT_TIMEOUT_MS = 1500;
  
  let activeQuestionIndex = 0;
  let money = 0;
  
  START_GAME_BUTTONS.forEach(button => {
    button.addEventListener('click', startNewGame)
  })
  
  function startNewGame() {
    showScreen(1);
    setActiveQuestion(0);
    updateMoney(0);
  }
  
  function showScreen(index) {
    SCREENS_NODES.forEach((screen, i)=>{
      screen.classList.toggle('visible', i === index);
    })
  }
  
  function updateMoney(newMoney) {
    money = newMoney;
    MONEY_NODES.forEach(moneyNode => {
      moneyNode.textContent = money;
    }) 
  }
  
  function setActiveQuestion(index) {
    activeQuestionIndex = index;
  
    const QUESTION_NODE = document.querySelector('.question');
    const IMG_NODE = document.querySelector('.question-img');
    const activeQuestion = QUESTIONS[index];
  
    QUESTION_NODE.textContent = activeQuestion.text;
  
    // Показываем или скрываем картинку
    if (activeQuestion.img) {
      IMG_NODE.style.display = '';
      IMG_NODE.src = activeQuestion.img;
    } else {
      IMG_NODE.style.display = 'none';
      IMG_NODE.src = '';
    }
  
    activeQuestion.isChecking = false;

    ANSWERS_NODES.forEach(answerNode => {
      answerNode.classList.remove('active', 'right');
    });
  
    setupAnswers(activeQuestion);
  }  
  
  function setupAnswers(question) {
    const letters = ['A', 'B', 'C', 'D'];
    ANSWERS_NODES.forEach((answerNode, index) => {
    answerNode.textContent = `${letters[index]}. ${question.answers[index]}`;
  
    answerNode.addEventListener('click', () => {
      handleAnswerClick(answerNode, question);
    })
    })
  }
  
  async function handleAnswerClick(answerNode, question) {
    if (question.isChecking){
      return;
    }
    
    question.isChecking = true;
  
    await highlightAnswer(answerNode,'active');
  
    const rightAnswerNode = ANSWERS_NODES[question.rightIndex];
  
    const isRightAnswer = rightAnswerNode.textContent === answerNode.textContent;
  
    await highlightAnswer(rightAnswerNode, 'right');
  
    if (!isRightAnswer) {
      showScreen(2);
      return;
    }
    
    const isLastQuestion = activeQuestionIndex === QUESTIONS.length - 1;
  
    if (isLastQuestion){
      showScreen(3);
    } else {
      setActiveQuestion(activeQuestionIndex + 1);
    }
  
    updateMoney(money + 200000);
    
  }
  
  async function highlightAnswer(answerNode, type) {
    answerNode.classList.add(type);
  
    await timeout(1500);
  
    clearClassNamesFromQuestion(answerNode);
  }
  
  function clearClassNamesFromQuestion(answerNode){
    ['active', 'right'].forEach(className => {
      answerNode.classList.remove(className)
    })
  }
  
  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
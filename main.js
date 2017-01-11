(function() {
    'use strict';

    // DOM elements
    const actionRecordedContainer = $('.actionRecorded');
    const buttonPressedContainer = $('.buttonPressed');
    const inputBox = $('#inputBox');
    const startButton = $('#startTracking');
    const stopButton = $('#stopTracking');
    let lastAction = 0;

    // Application state
    class Game {
      constructor(data = {}){
        this.trackingGame = false;
        this.data = data;
      }

      trackLastAction(keycode) {
        lastAction = keycode
      }
    }

    /**
      - Goals
      - Shots
      - Shots on target
      - Corner kicks
      - Free Kicks
      - Offsides
      - Pass completion percentage
    **/

    const teamKeycodes = {
        // our team actions
        97: {
            button: 'a',
            action: 'Shot off target - Us',
        },
        115: {
            button: 's',
            action: 'Shot on Target - Us',
        },
        100: {
            button: 'd',
            action: 'Incomplete Pass - Us',
        },
        102: {
            button: 'f',
            action: 'Completed Pass - Us',
        },
        103: {
            button: 'g',
            action: 'Goal Scored - Us',
        },
        // other team actions
        104: {
            button: 'h',
            action: 'Goal Scored - Them',
        },
        59: {
            button: ';',
            action: 'Shot off target - Them',
        },
        108: {
            button: 'l',
            action: 'Shot on Target - Them',
        },
        107: {
            button: 'k',
            action: 'Incomplete Pass - Them',
        },
        106: {
            button: 'j',
            action: 'Completed Pass - Them',
        },
    };

    const displayLastButtonPressed = function _displayLastButtonPressed(e) {
        console.log(e.which);
        if (e.which === 32) {
          removeLastAction();
        }
        if (teamKeycodes[e.which]) {
            buttonPressedContainer.html(`${teamKeycodes[e.which].button}`);
            actionRecordedContainer.html(`${teamKeycodes[e.which].action}`);
            // track stats here
            saveStats(e.which);
            return false;
        } else {
            buttonPressedContainer.html('');
            actionRecordedContainer.html('');
            return false;
        }

    };

    const saveStats = function _saveStats(keycode){
      const gameId = getInput();
      const gameData = JSON.parse(loadFromLocalStorage(gameId));
      // const gameData = loadFromLocalStorage(gameId);
      const currentGame = new Game(gameData);
      console.log(currentGame);

      switch (keycode) {
        // our actions
        case 97: {
          currentGame.data.stats.us.shots += 1;
          console.log('us.shots',currentGame.data.stats.us.shots);
          currentGame.trackLastAction(97);
          console.log('last action: ',lastAction);
          break;
        }
        case 115: {
          currentGame.data.stats.us.shotsOnTarget += 1;
          console.log('us.shotsOnTarget',currentGame.data.stats.us.shotsOnTarget);
          currentGame.trackLastAction(115);
          console.log('last action: ',lastAction);
          break;
        }
        case 100: {
          currentGame.data.stats.us.incompletePasses += 1;
          console.log('us.incompletePasses',currentGame.data.stats.us.incompletePasses);
          currentGame.trackLastAction(100);
          break;
        }
        case 102:{
          currentGame.data.stats.us.completedPasses += 1;
          console.log('us.completedPasses',currentGame.data.stats.us.completedPasses);
          currentGame.trackLastAction(102);
          break;
        }
        case 103:{
          currentGame.data.stats.us.goals += 1;
          console.log('us.goals',currentGame.data.stats.us.goals);
          currentGame.trackLastAction(103);
          break;
        }
        // theri actions
        case 104:{
          currentGame.data.stats.them.goals += 1;
          console.log('them.goals',currentGame.data.stats.them.goals);
          currentGame.trackLastAction(104);
          break;
        }
        case 59:{
          currentGame.data.stats.them.shots += 1;
          console.log('them.shots)',currentGame.data.stats.them.shots);
          currentGame.trackLastAction(59);
          break;
        }
        case 108:{
          currentGame.data.stats.them.shotsOnTarget += 1;
          console.log('them.shotsOnTarget',currentGame.data.stats.them.shotsOnTarget);
          currentGame.trackLastAction(108);
          break;
        }
        case 107:{
          currentGame.data.stats.them.incompletePasses += 1;
          console.log('them.incompletePasses',currentGame.data.stats.them.incompletePasses);
          currentGame.trackLastAction(107);
          break;
        }
        case 106:{
          currentGame.data.stats.them.completedPasses += 1;
          console.log('them.completedPasses',currentGame.data.stats.them.completedPasses);
          currentGame.trackLastAction(106);
          break;
        }
        default:{
          return;
        }
      }
      saveToLocalStorage(gameId, currentGame.data);
    };

    const saveToLocalStorage = function _saveToLocalStorate(key,data){
      const value = JSON.stringify(data);
      localStorage.setItem(key,value);
      return;
    };

    const loadFromLocalStorage = function _loadFromLocalStorate(key){
      return localStorage.getItem(key);;
    };

    const clearInput = function _clearInput() {
      inputBox.val('');
      return;
    };

    const getInput = function _clearInput() {
      // console.log(inputBox.val());
      const val = inputBox.val()
      return val;
    };

    const startNewGame = function _startTracking(){
      /**
        - Set tracking to false
        - Get value from input box
        - Save initial game state to localStorage
        - The window.on('keypress') will lock out keypresses
        - Start tracking stats;
      **/
      const initialGameState = {
          // gameId: '',
          // complete: false,
          stats: {
              us: {
                  completedPasses: 0,
                  incompletePasses: 0,
                  shots: 0,
                  shotsOnTarget: 0,
                  goals: 0,
              },
              them: {
                  completedPasses: 0,
                  incompletePasses: 0,
                  shots: 0,
                  shotsOnTarget: 0,
                  goals: 0,
              }
          }
      };

      const gameId = getInput();
      if (gameId) {
        $(window).on('keypress', displayLastButtonPressed);
        if (localStorage.getItem(gameId)) {
          return;
        }else{
          const newGame = new Game(initialGameState);
          saveToLocalStorage(gameId, newGame.data);
        }
        return;
      }
      console.log('need a game id');
    };

    // const startTracking = function startTracking(gameId) {
    //
    //
    // };

    const unlockKeypad = function _unlockKeypad() {
      $(window).off('keypress', displayLastButtonPressed);
    };

    const stopTracking = function _stopTracking(){
      console.log('stop tracking');
      unlockKeypad();
      return;
    };

    const removeLastAction = function _removeLastAction(keycode){
      /**
        save stats function is too tightly coupled
        to incrementing. need to abstract
      **/
      if (alert('remove last action?')) {
        switch (keycode) {
          // our actions
          case 97: {
            currentGame.data.stats.us.shots -= 1;
            console.log('us.shots',currentGame.data.stats.us.shots);
            saveStats(keycode)
            break;
          }
          case 115: {
            currentGame.data.stats.us.shotsOnTarget -= 1;
            console.log('us.shotsOnTarget',currentGame.data.stats.us.shotsOnTarget);
            break;
          }
          case 100: {
            currentGame.data.stats.us.incompletePasses -= 1;
            console.log('us.incompletePasses',currentGame.data.stats.us.incompletePasses);
            break;
          }
          case 102:{
            currentGame.data.stats.us.completedPasses -= 1;
            console.log('us.completedPasses',currentGame.data.stats.us.completedPasses);
            break;
          }
          case 103:{
            currentGame.data.stats.us.goals -= 1;
            console.log('us.goals',currentGame.data.stats.us.goals);
            break;
          }
          // theri actions
          case 104:{
            currentGame.data.stats.them.goals -= 1;
            console.log('them.goals',currentGame.data.stats.them.goals);
            break;
          }
          case 59:{
            currentGame.data.stats.them.shots -= 1;
            console.log('them.shots)',currentGame.data.stats.them.shots);
            break;
          }
          case 108:{
            currentGame.data.stats.them.shotsOnTarget -= 1;
            console.log('them.shotsOnTarget',currentGame.data.stats.them.shotsOnTarget);
            break;
          }
          case 107:{
            currentGame.data.stats.them.incompletePasses -= 1;
            console.log('them.incompletePasses',currentGame.data.stats.them.incompletePasses);
            break;
          }
          case 106:{
            currentGame.data.stats.them.completedPasses -= 1;
            console.log('them.completedPasses',currentGame.data.stats.them.completedPasses);
            break;
          }
          default:{
            return;
          }
        }
      }

    }

    // $(window).on('keypress', displayLastButtonPressed);
    startButton.on('click', startNewGame);
    stopButton.on('click', stopTracking);



}());

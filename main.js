(function() {
    'use strict';

    // DOM elements
    const actionRecordedContainer = $('.actionRecorded');
    const buttonPressedContainer = $('.buttonPressed');
    const inputBox = $('#inputBox');
    const startButton = $('#startTracking');
    const stopButton = $('#stopTracking');

    // Application state
    class Game {
      constructor(data = {}){
        this.trackingGame = false;
        this.data = data;
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
        case 102:{
          console.log(currentGame.data.stats.us.completedPasses);
          currentGame.data.stats.us.completedPasses += 1;
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
      /**
        - Set tracking to false
      **/
      console.log('stop tracking');
      unlockKeypad();
      return;
    };

    // $(window).on('keypress', displayLastButtonPressed);
    startButton.on('click', startNewGame);
    stopButton.on('click', stopTracking);



}());

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
            return false;
        } else {
            buttonPressedContainer.html('');
            actionRecordedContainer.html('');
            return false;
        }

    };

    const saveToLocalStorage = function _saveToLocalStorate(key,data){
      const value = JSON.stringify(data);
      localStorage.setItem(key,value);
      return;
    };

    const loadFromLocalStorage = function _loadFromLocalStorate(key){
      localStorage.getItem(key);
      return;
    };

    const clearInput = function _clearInput() {
      inputBox.val('');
      return;
    };

    const getInput = function _clearInput() {
      return inputBox.val();
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
          gameId: '',
          complete: false,
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
        const newGame = new Game(initialGameState);
        console.log(newGame);
        saveToLocalStorage(gameId, JSON.stringify(newGame.data));
        lockKeypad();
        return;
      }
      console.log('need a game id');
    };

    const lockKeypad = function _lockButtons() {
      $(window).on('keypress', displayLastButtonPressed);
    };
    
    const unlockKeypad = function _lockButtons() {
      $(window).off('keypress', displayLastButtonPressed);
    };

    const stopTracking = function _startTracking(){
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
